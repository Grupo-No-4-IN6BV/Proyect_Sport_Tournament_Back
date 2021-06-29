'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var userController = require('../controllers/user.controller');

api.get('/getUsers', mdAuth.ensureAuth, userController.getUsers);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
/*api.put('/deleteUser/:id', mdAuth.ensureAuth, userController.removeUser);*/
api.post('/saveUserByAdmin', userController.saveUserByAdmin);

module.exports = api;