const Transfer = require('../models/transfer.model.js');
const msg = require('../../translations/transfer.js');

exports.getTransactions = (req, res) => {
    Transfer.find()
        .then(transactions => {
            res.send(transactions);
        }).catch(err => {
            res.status(500).send({
                message: err.message || msg.transactionError
            });
        });
};

