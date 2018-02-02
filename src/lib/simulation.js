"use strict"

const jsonfile = require('jsonfile');

var simulation = {
    running: false,
    resume: require('./simulation/resume'),
    simulate: require('./simulation/simulate'),
}

simulation.export = () => {
    const config = app.config.app()
    var filepath = __dirname + '/../../' + config.get('db.local.path') + '/exports/' + app.data.name + '.json'
    jsonfile.writeFileSync(filepath, app.data)
}

simulation.update = () => {
    app.message.log('Update simulation')
    app.navigation.update()
    app.network.update()
    app.graph.chart.load()
    app.controller.update()
    app.protocol.update()
    if (app.config.app().simulation.runAfterChange) {
        simulation.simulate.run()
    }
}

simulation.reload = () => {
    app.graph.init()
    app.controller.init()
    simulation.update()
}

simulation.init = () => {
    app.message.log('Initialize simulation')
    app.db.init()
    app.protocol.init()
    app.network.init().then(() => {
        app.navigation.init()
        simulation.reload()
    })
}

module.exports = simulation;
