'user strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var leagueSchema = Schema ({
    name: String,
    description: String,
    count: Number,
    image: String
})

module.exports = mongoose.model('league', leagueSchema);