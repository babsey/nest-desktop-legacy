"use strict"

const fs = require('fs');
const path = require('path');

var dataPath = process.env['NESTDESKTOP_DATA'] || path.join(process.env['HOME'], '.local/share/nest-desktop');
console.log('Initializing configuration and data in ' + dataPath)

// Sync data from install path
if ( !(fs.existsSync(dataPath)) ) {
    var cmd = 'rsync -a ' + path.join(__dirname, 'data/') + ' ' + dataPath;
    var exec = require('child_process').exec;
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.error(error)
        }
    });
}
