"use strict"

const path = require('path');

var screen = {}
screen.capture = function(id) {
    const config = app.config.app()
    var url = 'templates/simulation.html?simulation=' + id
    var filepath = config.get('db.local.path') + path.sep + 'images' + path.sep + id + '.png'
    setTimeout(function() {
        require('electron').remote.require('./main').capturePage(filepath);
    },1000)
}

module.exports = screen;
