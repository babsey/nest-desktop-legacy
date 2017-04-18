"use strict"

const fs = require('fs');
const path = require('path');

var screen = {}
screen.capture = function(data, overwrite) {
    const configApp = app.config.app()
    var filepath = path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png')
    if (fs.existsSync(filepath) && !overwrite) return
    require('electron').remote.require('./main').capturePage(filepath);
}

module.exports = screen;
