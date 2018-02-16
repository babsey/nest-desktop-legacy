"use strict"

const path = require('path');

var dataPath = process.env['NESTDESKTOP_DATA'] || path.join(process.env['HOME'], '.local/share/nest-desktop');
console.log('Synchronizing data to ' + dataPath)
var cmd = 'rsync -a ' + path.join(__dirname, 'data/') + ' ' + dataPath;
var exec = require('child_process').exec;
exec(cmd, function(error, stdout, stderr) {
    if (error) {
        console.error(error)
    }
});
