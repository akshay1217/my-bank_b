const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config/config.js');
const message = require('../../translations/user.js');

// Create and Save a new user
exports.signUp = (req, res) => {
    // Validate request
    if (!req.body.userName || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: message.fillForm
        });
    }

    const {userName, email, password,} = req.body;
    // Create a user
    const userObj = new User({
        userName,
        email : email.toString().toLowerCase(),
        password,
        
    });

    // Save user data in the database
    User.find({email : req.body.email.toString().toLowerCase()})
                .then(user => {
                    if (user.length > 0){
                        res.send({errorMessage: message.userExist})
                    }else {
                        userObj.save()
                        .then(data => { 
                            res.send({message: "success"});
                        }).catch(err => {
                            res.status(500).send({
                                message: err.message || message.signupError
                            });
                        });
                    }
                })

};


// Check for User sign In.

exports.signIn = (req, res) => {
    if (!req.body.email.toString().toLowerCase() || !req.body.password) {
        return res.status(400).send({
            message: message.fillForm
        });
    }

    User.find({email : req.body.email.toString().toLowerCase(), password: req.body.password})
        .then(user => {
            if (user.length > 0){
                // console.log(user)
                var token = jwt.sign({ userId: user[0]._id}, config.privateKey);
                res.send({
                    message: message.loginSuccess,
                    userId : user[0]._id,
                    token
                })
            }else {
                res.send({errorMessage: message.loginFailed});
            }        
        }).catch(err => {
            res.status(500).send({
                message: err.message || message.loginError
            });
        });
};

// Retrieve and return all Users from the database.

exports.findAllUsers = (req, res) => {
    User.find()
        .then(prods => {
            res.send(prods);
        }).catch(err => {
            res.status(500).send({
                message: err.message || message.userError
            });
        });
};


exports.deleteUserFromDB = (req, res) => {
    User.findByIdAndRemove(req.params._id)
        .then(prod => {
            if (!prod) {
                return res.status(404).send({
                    message: message.userNotFound + req.params._id
                });
            }
            res.send({ message: message.userRemoved });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: message.userNotFound + req.params._id
                });
            }
            return res.status(500).send({
                message: message.couldNotDeluser + req.params._id
            });
        });
};
