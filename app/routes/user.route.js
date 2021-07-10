module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const aunthentication = require('../middleware/authentication.js');

    // add item to Cart
    app.post('/user/signup', user.signUp);

    // Get Cart for a User
    app.post('/user/login', user.signIn);

    // Get Cart for a User
    app.get('/users', aunthentication,  user.findAllUsers);

    // Delete a user from database with Id
    app.delete('/user/delete/:_id', aunthentication , user.deleteUserFromDB);

}