const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config/config.js');
const msg = require('../../translations/user.js');

// Create and Save a new user
exports.signUp = (req, res) => {
    // Validate request
    if (!req.body.userName || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: msg.fillForm
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
                        res.send({errorMessage: msg.userExist})
                    }else {
                        userObj.save()
                        .then(data => { 
                            res.send({message: "success"});
                        }).catch(err => {
                            res.status(500).send({
                                message: err.message || msg.signupError
                            });
                        });
                    }
                })

};


// Check for User sign In.

exports.signIn = (req, res) => {
    if (!req.body.email.toString().toLowerCase() || !req.body.password) {
        return res.status(400).send({
            message: msg.fillForm
        });
    }

    User.find({email : req.body.email.toString().toLowerCase(), password: req.body.password})
        .then(user => {
            if (user.length > 0){
                // console.log(user)
                var token = jwt.sign({ userId: user[0]._id}, config.privateKey);
                res.send({
                    message: msg.loginSuccess,
                    userId : user[0]._id,
                    token
                })
            }else {
                res.status(401).send({errorMessage: msg.loginFailed});
            }        
        }).catch(err => {
            res.status(500).send({
                message: err.message || msg.loginError
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
                message: err.message || msg.userError
            });
        });
};


exports.deleteUserFromDB = (req, res) => {
    User.findByIdAndRemove(req.params._id)
        .then(prod => {
            if (!prod) {
                return res.status(404).send({
                    message: msg.userNotFound + req.params._id
                });
            }
            res.send({ message: msg.userRemoved });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: msg.userNotFound + req.params._id
                });
            }
            return res.status(500).send({
                message: msg.couldNotDeluser + req.params._id
            });
        });
};
