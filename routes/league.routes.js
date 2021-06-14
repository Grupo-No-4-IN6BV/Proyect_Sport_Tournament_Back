'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var leagueController = require('../controllers/league.controller');

api.put('/saveLeague', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], leagueController.saveLeague);
api.put('/updateLeague/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], leagueController.updateLeague);
api.get('/removeLeague/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], leagueController.removeLeague);
api.post('/search', mdAuth.ensureAuth, leagueController.searchLeague);

module.exports = api;