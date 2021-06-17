'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = Schema({
    name: String,
    image: String,
    count: Number
})

module.exports = mongoose.model('team', teamSchema)