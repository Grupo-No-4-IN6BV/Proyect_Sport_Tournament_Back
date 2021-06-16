'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var leagueController = require('../controllers/league.controller');

api.put('/saveLeague', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], leagueController.saveLeague);
api.put('/:idU/updateLeague/:idL', mdAuth.ensureAuth, leagueController.updateLeague);
api.put('/:idU/removeLeague/:idL', mdAuth.ensureAuth, leagueController.removeLeague);
api.post('/search', mdAuth.ensureAuth, leagueController.searchLeague);
api.put('/:id/setLeague', mdAuth.ensureAuth, leagueController.setLeague);

module.exports = api;