'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var teamController = require('../controllers/team.controller');

api.put('/:id/setTeam', teamController.setTeam);
api.put('/:idL/updateTeam/:idT', teamController.updateTeam);
api.put('/:idL/removeTeam/:idT', teamController.removeTeam);
api.get('/getTeams', teamController.getTeams);


module.exports = api;