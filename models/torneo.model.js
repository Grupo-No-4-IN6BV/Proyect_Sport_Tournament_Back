'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var torneoSchema = Schema({
    name: String,
    description: String,
    rules: String,
    prize: String,
    players: String
})

module.exports = mongoose.model('torneo', torneoSchema)