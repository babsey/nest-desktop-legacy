"use strict"

window.d3 = require('d3');
require('bootstrap');

var app = {
    db: require(__dirname + '/lib/db'),
    chart: require(__dirname + '/lib/chart'),
    config: require(__dirname + '/lib/config'),
    events: require(__dirname + '/lib/events'),
    format: require(__dirname + '/lib/format'),
    message: require(__dirname + '/lib/message'),
    model: require(__dirname + '/lib/model'),
    navigation: require(__dirname + '/lib/navigation'),
    request: require(__dirname + '/lib/request'),
    screen: require(__dirname + '/lib/screen'),
    simChart: require(__dirname + '/lib/sim-chart'),
    simulation: require(__dirname + '/lib/simulation'),
    slider: require(__dirname + '/lib/slider'),
    sync: require(__dirname + '/lib/sync'),
}

module.exports = app
