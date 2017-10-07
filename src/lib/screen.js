"use strict"

const fs = require('fs');
const path = require('path');

var screen = {}
screen.capture = (data, overwrite) => {
    const configApp = app.config.app()
    var filepath = path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png')
    if (fs.existsSync(filepath) && !overwrite) return
    app.message.log('Capture screen')
    require('electron').remote.require('./main').capturePage(filepath);
}

module.exports = screen;
