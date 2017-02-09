"use strict"

require("bootstrap-slider");
var config_global = require('../config').global();
window.running = false;

let {
    host,
    port
} = config_global.get('nestServer');
var serverURL = host + ':' + port;

function server_check() {
    return $.ajax({
        method: "GET",
        url: "http://" + serverURL,
    }).fail(function(d) {
        app.message('Warning', 'The connection to the NEST server (' + serverURL + ') failed.')
    }).done(function() {
        window.serverRunning = true
        app.message('Success', 'The connection to the NEST server (' + serverURL + ')  established.')
    })
}

function request(mode, data) {
    return $.ajax({
        method: "POST",
        url: "http://" + serverURL + "/network/" + data.network + '/' + mode,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        message('Warning', d.responseText)
    })
}

function simulate(data) {
    return request('simulate', data)
}

function resume(data) {
    return request('resume', data)
}

$(document).bind("ajaxStart", function() {
    if (!(running)) {
        $("select").attr("disabled", 'disabled');
        $('.sliderInput').slider('disable')
    }
}).bind('ajaxStop', function() {
    $("select").attr("disabled", false);
    $('.sliderInput').slider('enable')
})

module.exports = {
    server_check: server_check,
    simulate: simulate,
    resume: resume
}
