'use strict';
const expressJoi = require('express-joi');
const Joi = expressJoi.Joi;
const TransactionRequest = require('../model/transactionRequest');
const History = require('../model/history');

var account = 0;
var historyUser = [];

module.exports.transactionController = async (req, res) => {
    let result;
    let transaction = new TransactionRequest(req.body);
    try {
        const requestValidSchema = Joi.object({
            type: Joi.string().required(),
            amount: Joi.number().min(1).required()
        });
        const isValidRequest = Joi.validate(transaction, requestValidSchema);
        if (!isValidRequest){
            if (transaction.type === 'credit') {
               result =  await doCredit(transaction);
            } else {
               result =  await doDebit(transaction);
            }
            if(result instanceof Error){
                fillResponseWithError(res, 400,  result);
            } else {
                fillResponse(res, 200, 'Success', historyUser[historyUser.length -1]);
            }
        } else {
            fillResponse(res, 400, 'Invalid input', isValidRequest.details[0].message, []);
        }

    } catch (err) {
        console.error(err);
        transaction.error = err;
        fillResponse(res, 400, 'Invalid status value', err);
    }
};

module.exports.historyController = async (req, res) => {
    try {
        fillResponse(res, 200, 'Success', historyUser);
    } catch (err) {
        console.error(err);
        fillResponse(res, 400, 'Error', err);
    }
};


module.exports.idController = async (req, res) => {
    try {
        let founded = false;
        const transactionId = req.params.id;
        // validate the request
        const tId = {id: transactionId};
        const requestValidSchema = Joi.object({
            id: Joi.string().guid().required()
        });
        const isValidRequest = Joi.validate(tId, requestValidSchema);
        if (!isValidRequest) {
            //search the transaction
            historyUser.every(function (transaction) {
                if (transaction.id === transactionId) {
                    fillResponse(res, 200, 'Success', transaction);
                    founded = true;
                    return false;
                } else {
                    return true;
                }
            });
            !founded ? fillResponse(res, 400, 'Error', 'Transaction not found') : null;
        }else {
            fillResponse(res, 400, 'Invalid ID supplied', isValidRequest.details[0].message, []);
        }
    } catch (err) {
        console.error(err);
        fillResponse(res, 400, 'Error', err);
    }
};

//debit
const doDebit = async function doDebit(transaction) {
    if(account >= transaction.amount){
        account -= transaction.amount;
        let history = new History(transaction);
        historyUser.push(history);
        return history;
    } else {
        return Promise.reject({e: 'Error', message: ('Not enough credit to do the transaction')});
    }
};

//credit
const doCredit = async function doCredit(transaction) {
    try{
        account += transaction.amount;
        let history = new History(transaction);
        historyUser.push(history);
        return history;
    } catch (e) {
        return Promise.reject({e: 'Error', message: 'Transaction error'});
    }
};

//create the user response
const fillResponse = (res, statusCode, statusMsg, message) => {
    return res.status(statusCode)
        .json({
            status: statusMsg,
            message: message
        });
};

const fillResponseWithError = (res, statusCode, errorObject) => {
    return res.status(statusCode)
        .json(errorObject);
};
