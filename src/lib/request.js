"use strict"

const request = require('request');
var req = {};

req.url = () => {
    let {
        host,
        port
    } = app.config.app().nest.server;
    return 'http://' + host + ':' + port;
}

req.server_check = () => {
    var url = req.url()
    return request.get(url)
        .on('error', (err) => {
            app.message.show('Warning', 'The connection to the NEST server failed.')
        })
        .on('response', () => {
            app.serverRunning = true
            app.message.log('NEST server checked')
        })
}

req.request = (data) => {
    var url = req.url()
    var running = (!(app.data.kernel.time == 0.0) || app.simulation.running) ? 'resume' : 'simulate'
    app.message.log('Start simulation')
    return $.ajax({
        method: 'POST',
        url: url + '/network/' + app.data.network + '/' + running,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail((d) => {
        app.message.show('Warning', d.responseText)
        app.simulation.simulate.end()
    }).done((d) => {
        app.message.log('Simulation finished.')
        if (d.error) {
            console.log(d.error)
            app.simulation.simulate.message.update({
                icon: 'fa fa-error',
                title: 'NEST Error:',
                message: d.error,
                type: 'danger'
            });
            setTimeout(() => app.simulation.simulate.end(), 5000);
        } else {
            app.simulation.simulate.end()
        }
    })
}

$(document).bind('ajaxStart', () => app.simulation.simulate.start())
    .bind('ajaxStop', () => app.simulation.simulate.end())

module.exports = req;
