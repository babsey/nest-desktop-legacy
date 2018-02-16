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
    var url = req.url();
    var running = (!(app.data.kernel.time == 0.0) || app.simulation.running) ? 'resume' : 'simulate';
    app.message.log('Start simulation')
    var delay = 5000
    return $.ajax({
        method: 'POST',
        url: url + '/network/' + app.data.network + '/' + running,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail((d) => {
        app.message.show('Warning', d.responseText, delay)
        app.simulation.simulate.end()
    }).done((d) => {
        app.message.log('Simulation finished.')
        if (d.error) {
            console.log(d.error)
            app.message.show('NEST Error', d.error, delay);
            setTimeout(() => app.simulation.simulate.end(), delay);
        } else {
            app.simulation.simulate.end()
        }
    })
}

$(document).bind('ajaxStart', () => app.simulation.simulate.start())
    .bind('ajaxStop', () => app.simulation.simulate.end())

module.exports = req;
