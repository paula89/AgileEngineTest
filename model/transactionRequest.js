
class TransactionRequest {
    constructor(body) {
        this.type = body.type;
        this.amount = body.amount;
    }
}

module.exports = TransactionRequest;
