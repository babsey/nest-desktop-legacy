"use strict"

const fs = require('fs');
const path = require('path');

var screen = {}
screen.capture = function(data, overwrite) {
    const config = app.config.app()
    var filepath = config.get('db.local.path') + path.sep + 'images' + path.sep + data._id + '.png'
    var pardir = __dirname + path.sep + '..' + path.sep + '..'
    if ((fs.existsSync(pardir + path.sep + filepath)) && !overwrite) return
    require('electron').remote.require('./main').capturePage(filepath);
}

module.exports = screen;
