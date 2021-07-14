module.exports = (app) => {
    const transfer = require('../controllers/transfer.controller.js');
    const aunthentication = require('../middleware/authentication.js');

    // get all transactions
    app.get('/transactions',aunthentication, transfer.getTransactions);

}