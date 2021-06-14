'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var user = require('./controllers/user.controller')
var port = 3800;
var leagueInit = require('./controllers/league.controller');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/DB_SportTournamentG4', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        user.initAdmin();
        leagueInit.createDefault();
        console.log('connect to database');
        app.listen(port, ()=>{
            console.log('server express is running')
        })
    }).catch((err)=>console.log('connection error to database', err))