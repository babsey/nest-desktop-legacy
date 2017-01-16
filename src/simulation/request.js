"use strict"

const $ = require("jquery");
require("bootstrap-slider");
const config = require('../config');
const message = require('../message');

let {
    host,
    port
} = config.get('nestServer');
let serverURL = host + ':' + port;

window.running = false;
window.serverRunning = false;

function server_check() {
    return $.ajax({
        method: "GET",
        url: "http://" + serverURL + '/',
    }).fail(function(d) {
        message('Warning', 'The connection to the NEST server failed.')
    }).done(function() {
        window.serverRunning = true
        message('Success', 'The connection to the NEST server established.')
    })
}

function request(url, data) {
    return $.ajax({
        method: "POST",
        url: "http://" + serverURL + "/network/" + data.network + '/' + url,
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
