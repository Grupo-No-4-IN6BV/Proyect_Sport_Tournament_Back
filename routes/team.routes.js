'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var teamController = require('../controllers/team.controller');


module.exports = api;