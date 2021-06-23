'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var teamController = require('../controllers/team.controller');

api.put('/:idU/:id/setTeam', teamController.setTeam);
api.put('/:idL/updateTeam/:idT', teamController.updateTeam);
api.put('/:idL/removeTeam/:idT', teamController.removeTeam);
api.get('/getTeams', teamController.getTeams);
api.put('/:idL/updateMach/:idT', teamController.updateMach);
api.put('/getMatches/:idL', teamController.getMatches);


module.exports = api;