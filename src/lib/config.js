"use strict"

const path = require('path');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');

var config = {};

config.app = () => require(path.join(app.dataPath, 'config/app.json'));

config.save = (filename, config) => {
    jsonfile.writeFile(path.join(app.dataPath, 'config', filename + '.json'), config, {
        spaces: 4
    }, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

config.nest = (name) => jsonfile.readFileSync(path.join(app.dataPath, 'config/nest', name + '.json'));

config.randomSeed = (randomSeed) => {
    var configApp = app.config.app();
    configApp.simulation.randomSeed = randomSeed;
    app.config.save('app', configApp)
    app.simulation.randomSeed = randomSeed;
    $('#random-seed').find('.glyphicon-ok').toggle(randomSeed)
}

config.events = () => {
    $('#chart-color').on('click', () => {
        var color = config.app().graph.color || false
        var configApp = config.app();
        configApp.graph.color = !color;
        config.save('app', configApp)
        $('#chart-color').find('.glyphicon-ok').toggle(!color)
        app.graph.update()
    })
    $('#view-networkLayout').on('click', () => {
        var configApp = config.app();
        var networkLayoutView = !configApp.graph.networkLayout.view || false
        configApp.graph.networkLayout.view = networkLayoutView;
        config.save('app', configApp)
        app.graph.networkLayout.toggleView(networkLayoutView)
    })
    $('#center-networkLayout').on('click', () => {
        var configApp = config.app();
        var networkLayoutCenter = !configApp.graph.networkLayout.center || false
        configApp.graph.networkLayout.center = networkLayoutCenter;
        config.save('app', configApp)
        app.graph.networkLayout.toggleCenter(networkLayoutCenter)
    })
    $('#run-after-change').on('click', () => {
        var configApp = app.config.app();
        var runAfterChange = configApp.simulation.runAfterChange || false
        configApp.simulation.runAfterChange = !runAfterChange;
        app.simulation.runAfterChange = !runAfterChange;
        config.save('app', configApp)
        $('#run-after-change').find('.glyphicon-ok').toggle(!runAfterChange)
        $('button.simulation-run').toggleClass('active', !runAfterChange)
    })
    $('#auto-reset').on('click', () => {
        var configApp = app.config.app();
        var autoReset = configApp.simulation.autoReset || false
        configApp.simulation.autoReset = !autoReset;
        app.simulation.autoReset = !autoReset;
        config.save('app', configApp)
        $('#auto-reset').find('.glyphicon-ok').toggle(!autoReset)
    })
    $('#random-seed').on('click', () => {
        var randomSeed = app.config.app().simulation.randomSeed || false
        config.randomSeed(!randomSeed)
    })
    $('#auto-protocol').on('click', () => {
        var configApp = app.config.app();
        var autoProtocol = configApp.simulation.autoProtocol || false
        configApp.simulation.autoProtocol = !autoProtocol;
        app.simulation.autoProtocol = !autoProtocol;
        config.save('app', configApp)
        $('#auto-protocol').find('.glyphicon-ok').toggle(!autoProtocol)
        $('button.protocol').toggleClass('active', !autoProtocol)
    })
}

config.init = () => {
    var configApp = config.app()
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
        config.save('app', configApp)
    }
}

module.exports = config
