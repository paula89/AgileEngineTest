const uuid = require('uuid/v4');

class History {
    constructor(body) {
            this.id = uuid();
            this.type = body.type;
            this.amount =  body.amount;
            this. effectiveDate = new Date(Date.now());
    }
}

module.exports = History;
