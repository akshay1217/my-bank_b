module.exports = (app) => {
    const payee = require('../controllers/payee.controller.js');
    const aunthentication = require('../middleware/authentication.js');

    // add payee
    app.post('/payee/add',aunthentication, payee.addPayee);

    // find payee
    app.post('/payee',aunthentication, payee.findAllPayee);

    //find payee to add
    app.post('/payee/payeeToAdd', aunthentication, payee.getPayeeListToAdd);

   // Delete a payee from list for a user
   app.delete('/payee/delete', aunthentication , payee.deletePayee);
}