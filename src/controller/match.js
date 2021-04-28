'use strict'

var Match = require ('../models/match');

var controller = {

    saveMatch: function (req){
        var match = new Match;
        match.game =req
        match.save()
    },
    getMatchs: function (req, res){
        return Match.find({}).sort({ 'game.gameCreation': -1 }).limit(20)        
        
    }

}

module.exports = controller;