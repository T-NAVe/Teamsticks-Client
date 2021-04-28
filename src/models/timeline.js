'use strict'

var mongoose = require ('mongoose');
var Schema =mongoose.Schema; 

var timeLineSchema = new Schema({
gameId: String,
frames: Array
},{ autoCreate: true});

module.exports = mongoose.model('TimeLine',timeLineSchema)
