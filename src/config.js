"use strict"

const fs = require('fs')
const Config = require('electron-config');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');
var config = {};

config.global = function() {
    var defaults = jsonfile.readFileSync('./config/configDefaults.json')
    defaults.db_name = "network-" + uuidV4()
    return new Config({
        defaults: defaults
    });
}

config.models = function(name) {
    return jsonfile.readFileSync('./config/models/' + name + '.json')
}

config.simulation = function(name) {
    return jsonfile.readFileSync('./config/simulation/' + name + '.json')
}

config.export = function(name, obj) {
    var filepath = './config/export/' + name + '.json'
    var fd = fs.openSync(filepath, 'w');
    jsonfile.writeFileSync(filepath, obj, {
        spaces: 4
    })
}

module.exports = config
