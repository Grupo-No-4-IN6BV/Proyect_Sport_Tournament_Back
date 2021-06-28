'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var teamController = require('../controllers/team.controller');

api.put('/:idU/:id/setTeam', mdAuth.ensureAuth, teamController.setTeam);
api.put('/:idL/updateTeam/:idT/:idU', mdAuth.ensureAuth,  teamController.updateTeam);
api.put('/:idL/removeTeam/:idT', mdAuth.ensureAuth,  teamController.removeTeam);
api.get('/getTeams', mdAuth.ensureAuth,  teamController.getTeams);
api.put('/:idL/updateMach/:idT', mdAuth.ensureAuth,  teamController.updateMach);
api.put('/getMatches/:idL', mdAuth.ensureAuth,  teamController.getMatches);



module.exports = api;