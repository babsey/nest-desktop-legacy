"use strict"

var $ = require("jquery");
require("bootstrap-slider");

$(document).bind("ajaxStart", function() {
    $("select").attr("disabled", "disabled");
    $('.sliderInput').slider('disable')
}).bind('ajaxStop', function() {
    $("select").attr("disabled", false);
    $('.sliderInput').slider('enable')
})

function simulate(url, data) {
    return $.ajax({
        method: "POST",
        url: "http://localhost:5000/simulate/" + url,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        alert(d.statusText)
    })
}

function network(id) {
    return $.ajax({
        method: "GET",
        url: "http://localhost:5000/network/" + id,
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        alert(d.statusText)
    })
}

function network_list(nest_app) {
    return $.ajax({
        method: "GET",
        url: "http://localhost:5000/network/list/" + nest_app,
    }).fail(function(d) {
        alert(d.statusText)
    })
}

function network_add(data) {
    return $.ajax({
        method: "POST",
        url: "http://localhost:5000/network/add/",
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
    }).fail(function(d) {
        alert(d.statusText)
    })
}


module.exports = {
    simulate: simulate,
    network_list: network_list,
    network_add: network_add,
    network: network,
}
