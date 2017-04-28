"use strict"

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');

var appPath = process.cwd();
console.log('Initializing configuration and data in ' + appPath)

module.exports = new Promise((resolve, reject) => {
    // Copy config file from defaults
    if (!fs.existsSync(path.join(appPath, 'config'))) {
        var cmd = 'rsync -avz ' + path.join(__dirname, 'src', 'configDefaults', '*.json') + ' ' + path.join(appPath, 'config');
        var exec = require('child_process').exec;
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                console.error(error)
            }
        });
        var cmd = 'rsync -avz ' + path.join(__dirname, 'src', 'configDefaults', 'nest') + ' ' + path.join(appPath, 'config');
        var exec = require('child_process').exec;
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                console.error(error)
            }
        });
    }
    var cmd = 'rsync -avz ' + path.join(__dirname, 'src', 'configDefaults', 'simulation') + ' ' + path.join(appPath, 'config');
    var exec = require('child_process').exec;
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.error(error)
        }
    });
    resolve('Done')
}).then((onResolved, onRejected) => {
    if (fs.existsSync(path.join(appPath, 'config'))) {
        var configApp = require(path.join(appPath, 'config', 'app.json'));
        var changed = false
        if (!configApp.user.id) {
            configApp.user.id = uuidV4();
            changed = true
        }
        if (!configApp.user.name) {
            configApp.user.name = process.env.USER;
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
            jsonfile.writeFile(path.join(appPath, 'config', 'app.json'), configApp, {
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
    var configApp = require(path.join(appPath, 'config', 'app.json'));
    var dirnames = ['.', 'images', 'protocols'];
    dirnames.map(function(dirname) {
        var dirpath = path.join(appPath, configApp.datapath, dirname);
        if (fs.existsSync(dirpath)) return
        fs.mkdirSync(dirpath)
    })
})
