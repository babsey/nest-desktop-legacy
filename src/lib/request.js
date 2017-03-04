"use strict"

require("bootstrap-slider");
var request = {};

request.serverURL = function() {
    let {
        host,
        port
    } = app.config.app().get('nest.server');
    var serverURL = host + ':' + port;
    return serverURL
}

request.server_check = function() {
    var serverURL = request.serverURL()
    var url = "http://" + serverURL
    return $.ajax({
        method: "GET",
        url: url,
    }).fail(function(d) {
        app.message.show('Warning', 'The connection to the NEST server (' + serverURL + ') failed.', 2000)
    }).done(function() {
        app.serverRunning = true
        app.message.show('Success', 'The connection to the NEST server (' + serverURL + ')  established.', 2000)
    })
}

request.request = function(data) {
    var url = "http://" + request.serverURL() + "/network/" + app.data.network + '/' + (app.simulation.running ? 'resume' : 'simulate')
    return $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        app.message.show('Warning', d.responseText, 2000)
    })
}

$(document).bind("ajaxStart", function() {
    // if (!(app.simulation.running)) {
    $("select").attr("disabled", 'disabled');
    $('.sliderInput.onlySimulate').slider('disable')
    // }
}).bind('ajaxStop', function() {
    $("select").attr("disabled", false);
    $('.sliderInput').slider('enable')
})

module.exports = request;
