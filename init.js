"use strict"

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');

var appPath = __dirname;
var dataPath = process.env['NESTDESKTOP_DATA'] || path.join(process.cwd(), 'data');
console.log('Initializing configuration and data in ' + dataPath)

module.exports = new Promise((resolve, reject) => {
    // Copy config file from defaults
    if (!fs.existsSync(path.join(dataPath, 'config'))) {
        var cmd = 'rsync -avz ' + path.join(appPath, 'src/configDefaults/*.json') + ' ' + path.join(dataPath, 'config');
        var exec = require('child_process').exec;
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                console.error(error)
            }
        });
        var cmd = 'rsync -avz ' + path.join(appPath, 'src/configDefaults/nest') + ' ' + path.join(dataPath, 'config');
        var exec = require('child_process').exec;
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                console.error(error)
            }
        });
    }
    var exec = require('child_process').exec;
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.error(error)
        }
    });
    resolve('Done')
}).then((onResolved, onRejected) => {
    if (fs.existsSync(path.join(dataPath, 'config'))) {
        var configApp = require(path.join(dataPath, 'config/app.json'));
        var changed = false
        if (!configApp.user.id) {
            configApp.user.id = uuidV4();
            changed = true
        }
        if (!configApp.version) {
            configApp.version = process.env.npm_package_version;
            changed = true
        }
        if (!configApp.db.name) {
            configApp.db.name = uuidV4();
            changed = true
        }

        if (changed) {
            jsonfile.writeFile(path.join(dataPath, 'config/app.json'), configApp, {
                spaces: 4
            }, function(err) {
                if (err) {
                    console.error(err)
                }
            })
        }
    }
}).then((onResolved, onRejected) => {
    // Create directories in data
    var dirnames = ['images', 'protocols', 'exports'];
    dirnames.map(function(dirname) {
        var dirpath = path.join(dataPath, dirname);
        if (fs.existsSync(dirpath)) return
        fs.mkdirSync(dirpath)
    })
})
