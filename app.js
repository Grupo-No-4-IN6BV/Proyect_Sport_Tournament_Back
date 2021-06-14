'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var userRoutes = require('./routes/user.routes');
var torneoRoutes = require('./routes/torneo.routes');
var leagueRoutes = require('./routes/league.routes');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(cors())
app.use('/api', torneoRoutes);
app.use('/api', userRoutes);
app.use('/api', leagueRoutes);

module.exports = app;