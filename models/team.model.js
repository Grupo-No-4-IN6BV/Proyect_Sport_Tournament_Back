'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = Schema({
    name: String,
    image: String,
    count: Number,
    leagueMatch: [{type: Schema.ObjectId, ref: "match"}]
})

module.exports = mongoose.model('team', teamSchema)