"use strict"

const path = require('path');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');

var config = {};

config.app = function() {
    return require(path.join(process.cwd(), 'config', 'app.json'));
}

config.save = function(filename, config) {
    jsonfile.writeFile(path.join(process.cwd(), 'config', filename + '.json'), config, {
        spaces: 4
    }, function(err) {
        if (err) {
            console.error(err)
        }
    })
}

config.nest = function(name) {
    return jsonfile.readFileSync(path.join(process.cwd(), 'config', 'nest', name + '.json'))
}

module.exports = config
