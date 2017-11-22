"use strict"

const fs = require('fs');
const path = require('path');

var screen = {}
screen.capture = (data, overwrite) => {
    const configApp = app.config.app()
    var filepath = path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png')
    if (fs.existsSync(filepath) && !overwrite) return
    app.message.log('Capture screen')
    setTimeout(() => require('electron').remote.require('./main').capturePage(filepath), 600.)
}

module.exports = screen;
