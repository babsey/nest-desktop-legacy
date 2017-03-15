"use strict"

window.d3 = require('d3');
require('bootstrap');

var app = {
    db: require(__dirname + '/lib/db'),
    chart: require(__dirname + '/lib/chart'),
    config: require(__dirname + '/lib/config'),
    controller: require(__dirname + '/lib/controller'),
    events: require(__dirname + '/lib/events'),
    format: require(__dirname + '/lib/format'),
    hash: require(__dirname + '/lib/hash'),
    message: require(__dirname + '/lib/message'),
    model: require(__dirname + '/lib/model'),
    navigation: require(__dirname + '/lib/navigation'),
    protocol: require(__dirname + '/lib/protocol'),
    renderer: require(__dirname + '/lib/renderer'),
    request: require(__dirname + '/lib/request'),
    screen: require(__dirname + '/lib/screen'),
    simulation: require(__dirname + '/lib/simulation'),
    slider: require(__dirname + '/lib/slider'),
    sync: require(__dirname + '/lib/sync'),
};

const fs = require('fs');
const path = require('path');
const config = app.config.app();
// Create directories in config.get('db.local.path')
var dirnames = ['.', 'images', 'exports', 'protocols'];
dirnames.map(function(dirname) {
    var dirpath = path.join(__dirname, '..', config.get('db.local.path'), dirname);
    if (fs.existsSync(dirpath)) return
    fs.mkdirSync(dirpath)
})

module.exports = app
