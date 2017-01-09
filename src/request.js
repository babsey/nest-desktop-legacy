"use strict"

var $ = require("jquery");
require("bootstrap-slider");
window.running = false;
window.serverRunning = false;

const Config = require('electron-config');
const config = new Config({
    defaults: {
        serverURL: {
            ip: 'localhost',
            port: '5000',
        }
    }
});

let {
    ip,
    port
} = config.get('serverURL');
let serverURL = ip + ':' + port;


function server_check() {
    return $.ajax({
        method: "GET",
        url: "http://" + serverURL + '/',
    }).fail(function(d) {
        console.log(d)
    }).done(function(d) {
        console.log(d)
        window.serverRunning = true
    })
}

function simulate(url, data) {
    return $.ajax({
        method: "POST",
        url: "http://" + serverURL + "/network/" + url,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        console.log(d)
    })
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
}
