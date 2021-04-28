'use strict'


var Timeline = require ('../models/timeline');

var controller = {
    saveTimeLine: function (req){
        var timeLine = new Timeline;
        timeLine.gameId = req.gameId
        timeLine.frames = req.frames
        timeLine.save()
    }
}

module.exports = controller;
