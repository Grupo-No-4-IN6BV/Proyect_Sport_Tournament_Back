'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secretKey = 'encriptacion-STG4@'

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({message: "The request does not carry authentication"})
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '');
        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token has expired'})
            }
        }catch(err){
            return res.status(404).send({message: 'Token invalid'})
        }
        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next) => {
    var payload = req.user;

    if(payload.role != 'ROLE_ADMIN'){
        return res.status(404).send({message: 'No permissions required to access'})
    }else{
       return next(); 
    }
}