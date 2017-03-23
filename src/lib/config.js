"use strict"

const fs = require('fs')
const jsonfile = require('jsonfile');
const Configstore = require('configstore');
const uuidV4 = require('uuid/v4');

var config = {};

config.app = function() {
    const pkg = require(__dirname + '/../../package.json');
    var filepath = __dirname + '/../config/appDefaults.json'
    var obj = jsonfile.readFileSync(filepath);
    const conf = new Configstore(pkg.name, obj);
    if (!conf.get('user.id')) {
        conf.set('user.id', uuidV4())
    }
    if (!conf.get('user.name')) {
        conf.set('user.name', process.env.USER);
    }
    if (!conf.get('version')) {
        conf.set('version', process.env.npm_package_version);
    }
    if (!conf.get('db.name')) {
        conf.set('db.name', uuidV4())
    }
    return conf
}

config.modelSlider = function(name) {
    return jsonfile.readFileSync(__dirname + '/../config/modelSlider/' + name + '.json')
}

config.simulation = function(name) {
    if (name == undefined) {
        return fs.readdirSync(__dirname + '/../simulationExamples/')
    }
    return jsonfile.readFileSync(__dirname + '/../simulationExamples/' + name + '.json')
}

module.exports = config
