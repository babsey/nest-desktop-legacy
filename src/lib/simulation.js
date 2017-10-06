"use strict"

const jsonfile = require('jsonfile');

var simulation = {
    running: false,
    resume: require('./simulation/resume').resume,
    simulate: require('./simulation/simulate').simulate,
}

simulation.export = () => {
    const config = app.config.app()
    var filepath = __dirname + '/../../' + config.get('db.local.path') + '/exports/' + app.data.name + '.json'
    jsonfile.writeFileSync(filepath, app.data)
}

simulation.run = (running) => {
    simulation.running = (running == true)
    if (simulation.running) {
        $('#simulation-resume').find('.resume').hide()
        $('#simulation-resume').find('#simulation-stop').show()
        $('.dataSlider').find('.sliderInput').slider('disable')
        simulation.resume()
    } else {
        $('#simulation-resume').find('.resume').hide()
        $('#simulation-resume').find('#simulation-start').show()
        $('.dataSlider').find('.sliderInput').slider('enable')
    }
}

simulation.resumeToggle = () => {
    simulation.run(!simulation.running)
}

simulation.stop = () => new Promise((resolve, reject) => {
    simulation.running = false;
    resolve()
});


simulation.update = () => {
    app.message.log('Update simulation')
    simulation.running = false;
    app.selected_node = null;
    app.selected_link = null;

    app.network.update()
    simulation.simulate()
}

simulation.reset = () => {
    app.data.kernel.time = 0.0
    $('#autoscale').prop('checked', 'checked')
    simulation.update()
}

simulation.init = () => {
    app.message.log('Initialize simulation')
    app.db.init()
    app.protocol.init()
    app.network.init().then(() => {
        app.chart.init()
        app.controller.init()
        app.navigation.init()

        app.protocol.update()
        app.navigation.update()
        simulation.update()
    })
}

module.exports = simulation;
