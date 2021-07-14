const Payee = require('../models/payee.model.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config/config.js');
const msg = require('../../translations/payee.js');

// Add and Save a new payee
exports.addPayee = (req, res) => {
    // Validate request
    if (!req.body.userId || !req.body.payeeId ) {
        return res.status(400).send({
            message: msg.dataMissing
        });
    }

    const {userId, payeeId} = req.body;
    // add Payee
    const payeeObj = new Payee({
        userId,
        payeeId
    });

    // Save payee data in the database
    Payee.find({userId, payeeId})
                .then(payee => {
                    if (payee.length > 0){
                        res.send({errorMessage: msg.payeeExist})
                    }else {
                        payeeObj.save()
                        .then(data => { 
                            res.send({message: "success"});
                        }).catch(err => {
                            res.status(500).send({
                                message: err.message || msg.payeeError
                            });
                        });
                    }
                })
};

// Retrieve and return all Users from the database.

exports.findAllPayee = (req, res) => {
    let payeeListNames = []
    Payee.find({userId: req.body.userId})
        .then(payeeList => {
                payeeList.map((item, index)=>{
                    payeeList.push(item.payeeId)
                })
                    User.find({ _id : {$in: payeeList}})
                        .then(payeeList => {
                            res.send(payeeList);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || msg.payeeNotFound
                            });
                        })
        }).catch(err => {
            res.status(500).send({
                message: err.message || msg.payeeError
            });
        });
};
 
// get list of payee which are not added yet
exports.getPayeeListToAdd = (req, res) => {
    let payeeListToExclude = []
    Payee.find({userId: req.body.userId})
        .then(payeeList => {
                // console.log('payeelist', payeeList)
                payeeList.map((item, index)=>{
                    payeeListToExclude.push(item.payeeId)
                })
                payeeListToExclude.push(req.body.userId)
                // console.log('payeeListToExclude', payeeListToExclude)
                    User.find({ _id : {$nin: payeeListToExclude}})
                        .then(payeeListForUser => {
                            //  console.log('payeeListForUser', payeeListForUser)
                            res.send(payeeListForUser);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || msg.payeeNotFound
                            });
                        })
        }).catch(err => {
            res.status(500).send({
                message: err.message || msg.payeeError
            });
        });
};

// delete payee 
exports.deletePayee = (req, res) => {
    Payee.remove({ userId:req.body.userId, payeeId: req.body.payeeId })
        .then(list => {
            if (!list) {
                return res.status(404).send({
                    message: msg.payeeNotFound + req.body.payeeId
                });
            }
            res.send({ message: msg.userRemoved });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: msg.payeeNotFound + req.body.payeeId
                });
            }
            return res.status(500).send({
                message: msg.couldNotDelPayee + req.body.payeeId
            });
        });
};


