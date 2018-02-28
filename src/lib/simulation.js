"use strict"

const jsonfile = require('jsonfile');
const path = require('path');

var simulation = {
    running: false,
    resume: require('./simulation/resume'),
    simulate: require('./simulation/simulate'),
}

simulation.export = () => {
    var filepath = path.join(app.dataPath, 'exports', app.data.name + '.json');
    jsonfile.writeFileSync(filepath, app.data)
}

simulation.update = () => {
    app.message.log('Update simulation')
    app.navigation.update()
    app.network.update()
    app.graph.chart.load()
    app.controller.update()
    app.protocol.update()
    if (app.config.app().simulation.autoSimulation) {
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

simulation.events = () => {
    $('.simulation-run').on('click', simulation.simulate.run)
    $('#simulation-resume').on('click', simulation.resume.start)
    $('#simulation-clone').on('click', (e) => {
        $('#simulation-clone-submit').show()
        var simulationForm = $('#simulation-form');
        simulationForm.find('#simulation-name').attr('disabled', false).focus()
        simulationForm.find('#simulation-description').hide()
    })
    $('.simulation-edit').on('click', (e) => {
        $('#simulation-edit-submit').show()
        var simulationForm = $('#simulation-form');
        simulationForm.find('#simulation-name').val(app.data.name).attr('disabled', 'disabled')
        simulationForm.find('#simulation-description').show().val(app.data.description).focus()
    })
    $('#simulation-form-dialog').on('hidden.bs.modal', (e) => {
        $('#simulation-form button[type="submit"]').hide()
    })
    $('#simulation-clone-submit').on('click', function(e) {
        var simulationForm = $('#simulation-form');
        var simulationName = simulationForm.find('#simulation-name').val();
        if (simulationName.length == 0) return
        $(this).hide(() => {
            app.db.clone(app.data).then((data) => {
                data.name = simulationName;
                app.db.add(data).then(() => {
                    location.href = 'simulation.html?simulation=' + data._id;
                });
            });
        })
    })
    $('#simulation-edit-submit').on('click', function(e) {
        $(this).hide(() => {
            app.data.description = $('#simulation-form #simulation-description').val();
            $('.description').html(app.data.description)
            app.protocol.add(app.data)
        })
    })
}

module.exports = simulation;
