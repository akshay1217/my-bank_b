const config = require('../../config/config.js');

var jwt = require('jsonwebtoken');

const aunthentication = (req,res,next) => {
    let { token } = req.headers;

    if(!token){
        res.status(401).send({
            message: "user unauthorized"
        });
    }

    jwt.verify(token, config.privateKey, function(err, decoded) {
        if(err){
            res.status(401).send({
                message: "user unauthorized"
            });
        }else{
            //success
            next();
        }
    });
} 

module.exports = aunthentication;