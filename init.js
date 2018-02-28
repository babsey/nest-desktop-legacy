"use strict"

const path = require('path');

var init = {};

init.sync = (dataPath) => {
    console.log('Synchronizing data to ' + dataPath)
    var cmd = 'rsync -a --ignore-existing ' + path.join(__dirname, 'src/data/') + ' ' + dataPath;
    var exec = require('child_process').exec;
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.error(error)
        }
    });
}

module.exports = init;
