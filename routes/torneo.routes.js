'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var torneoController = require('../controllers/torneo.controller');

api.get('/createTorneo', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.createTorneo);
api.put('/removeTorneo/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.removeTorneo);
api.put('/updateTorneo/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.updateTorneo);
api.get('/getTorneo/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.getTorneo);
api.get('/getTorneos', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.getTorneos);

module.exports = api;
