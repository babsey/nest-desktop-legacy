"use strict"

const path = require('path');
require('bootstrap');

var appPath = __dirname;
var dataPath = process.env['NESTDESKTOP_DATA'] || path.join(process.env['HOME'], '.nest-desktop');

var app = {
    appPath: appPath,
    dataPath: dataPath,
    config: require(appPath + '/lib/config'),
    controller: require(appPath + '/lib/controller'),
    db: require(appPath + '/lib/db'),
    format: require(appPath + '/lib/format'),
    graph: require(appPath + '/lib/graph'),
    hash: require(appPath + '/lib/hash'),
    math: require(appPath + '/lib/math'),
    message: require(appPath + '/lib/message'),
    model: require(appPath + '/lib/model'),
    navigation: require(appPath + '/lib/navigation'),
    network: require(appPath + '/lib/network'),
    print: require(appPath + '/lib/print'),
    protocol: require(appPath + '/lib/protocol'),
    renderer: require(appPath + '/lib/renderer'),
    request: require(appPath + '/lib/request'),
    screen: require(appPath + '/lib/screen'),
    simulation: require(appPath + '/lib/simulation'),
    slider: require(appPath + '/lib/slider'),
    sync: require(appPath + '/lib/sync'),
    validation: require(appPath + '/lib/validation'),
    resizing: false,
};

app.query = function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}


module.exports = app
