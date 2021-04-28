'use strict'

var mongoose = require ('mongoose');
var Schema =mongoose.Schema; 
//Due to de complexity of the schema i've decided to just upload the entire object into the db.
//This may not be the best way of handling this information, you may want to do a proper schema.
//Given that the data is very consistent this is probably not necessary.
var matchSchema = new Schema({
game: Object
},{ autoCreate: true});

module.exports = mongoose.model('Match',matchSchema)
