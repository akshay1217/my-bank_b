module.exports = (app) => {
    const payee = require('../controllers/payee.controller.js');
    const aunthentication = require('../middleware/authentication.js');

    // add payee
    app.post('/payee/add',aunthentication, payee.addPayee);

    // find payee
    app.get('/payee',aunthentication, payee.findAllPayee);

   // Delete a payee from list for a user
   app.delete('/payee/delete', aunthentication , payee.deletePayee);

}