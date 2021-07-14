const mongoose = require('mongoose');

const PayeeSchema = mongoose.Schema({
    userId : {
        type: String,
        require: true
    },
    payeeId : {
        type: String,
        require: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Payee', PayeeSchema);