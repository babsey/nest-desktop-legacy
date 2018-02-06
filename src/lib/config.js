"use strict"

const path = require('path');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');

var config = {};

config.app = () => require(path.join(process.cwd(), 'config', 'app.json'));

config.save = (filename, config) => {
    jsonfile.writeFile(path.join(process.cwd(), 'config', filename + '.json'), config, {
        spaces: 4
    }, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

config.nest = (name) => jsonfile.readFileSync(path.join(process.cwd(), 'config', 'nest', name + '.json'));

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
        var networkLayout = !configApp.graph.networkLayout || false
        configApp.graph.networkLayout = networkLayout;
        config.save('app', configApp)
        app.graph.networkLayout.toggle(networkLayout)
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

module.exports = config
