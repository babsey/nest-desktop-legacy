"use strict"

var $ = require("jquery");
require("bootstrap-slider");
window.running = false;

$(document).bind("ajaxStart", function() {
    if (!(running)) {
        $("select").attr("disabled", 'disabled');
        $('.sliderInput').slider('disable')
    }
}).bind('ajaxStop', function() {
    $("select").attr("disabled", false);
    $('.sliderInput').slider('enable')
})

function version_check() {
    return $.ajax({
        method: "GET",
        url: "http://localhost:5000/check/versions/",
    }).fail(function(d) {
        console.log(d)
        window.serverRunning = false
    }).done(function(d) {
        console.log(d)
        window.serverRunning = true
    })
}

function network(id) {
    return $.ajax({
        method: "GET",
        url: "http://localhost:5000/network/" + id,
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        console.log(d)
    })
}

function network_add(data) {
    return $.ajax({
        method: "POST",
        url: "http://localhost:5000/network/add/",
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        console.log(d)
    })
}

function network_list(nest_app) {
    return $.ajax({
        method: "GET",
        url: "http://localhost:5000/network/list/" + nest_app,
    }).fail(function(d) {
        console.log(d)
    })
}

function simulate(url, data) {
    return $.ajax({
        method: "POST",
        url: "http://localhost:5000/network/" + url,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        console.log(d)
    })
}

module.exports = {
    version_check: version_check,
    network: network,
    network_add: network_add,
    network_list: network_list,
    simulate: simulate,
}
