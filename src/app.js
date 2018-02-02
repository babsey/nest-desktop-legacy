"use strict"

window.d3 = require('d3');
require('bootstrap');

const path = require('path');

var app = {
    __dirname: __dirname,
    config: require(__dirname + '/lib/config'),
    controller: require(__dirname + '/lib/controller'),
    db: require(__dirname + '/lib/db'),
    format: require(__dirname + '/lib/format'),
    graph: require(__dirname + '/lib/graph'),
    hash: require(__dirname + '/lib/hash'),
    message: require(__dirname + '/lib/message'),
    model: require(__dirname + '/lib/model'),
    navigation: require(__dirname + '/lib/navigation'),
    network: require(__dirname + '/lib/network'),
    print: require(__dirname + '/lib/print'),
    protocol: require(__dirname + '/lib/protocol'),
    renderer: require(__dirname + '/lib/renderer'),
    request: require(__dirname + '/lib/request'),
    screen: require(__dirname + '/lib/screen'),
    simulation: require(__dirname + '/lib/simulation'),
    slider: require(__dirname + '/lib/slider'),
    sync: require(__dirname + '/lib/sync'),
    validation: require(__dirname + '/lib/validation'),
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
