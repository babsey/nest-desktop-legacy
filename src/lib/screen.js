"use strict"

const fs = require('fs');
const path = require('path');

var screen = {}
screen.capture = (data, overwrite) => {
    var filepath = path.join(app.dataPath, 'images', data._id + '.png');
    if (fs.existsSync(filepath) && !overwrite) return
    app.message.log('Capture screen')
    setTimeout(() => require('electron').remote.require('./main').capturePage(filepath), 600.)
}

module.exports = screen;
