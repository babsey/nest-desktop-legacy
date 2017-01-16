"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');

var s = require("./slider");
var req = require('./request');
var vt = require('./voltage_trace');

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')
var nodes = {};

d3Request.csv('file://' + curpath + '/settings/models.csv', function(models) {
    models.forEach(function(model) {
        $("<option class='model_select' value=" + model.id + ">" + model.label + "</option>").appendTo("#id_" + model.type)
    })
})

function row(p) {
    return {
        id: p.id,
        label: p.label,
        level: p.level,
        slider: {
            value: +p.value,
            min: +p.min,
            max: +p.max,
            step: +p.step
        }
    }
}
s.slider('level', {
    value: 1,
    min: 1,
    max: 4,
    step: 1
})

function simulate(sim_time) {
    if (('neuron' in nodes) && ('input' in nodes)) {
        req.simulate(sim_time, nodes)
            .done(function(res) {
                data = res
                vt.update(data.events['times'], data.events['V_m'], data.time);
            })
    }
}

var update_params = function(node, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, row, function(params) {
        params.forEach(function(p) {
            $('#' + node).find('.params').append('<dt id="id_' + p.id + '" class="' + p.id + '">' + p.label + '</dt>')
            var param_slider = s.paramSlider(nodes, node, p.id, p.slider);
            param_slider.on("slideStop", function() {
                simulate(1000.)
            })
            if (p.level > $('#levelInput').attr('value')) {
                $('.' + p.id).addClass('hidden')
            }
        })
    })
}

$('.model .model_select').on('change', function() {
    var node = $(this).parents('.model').attr('id');
    $('#' + node).find('.params').empty();
    if (this.value == "") return;
    nodes[node] = {
        'model': this.value,
        'params': {}
    }
    update_params(node, this.value)
    simulate(1000.)
})

vt.voltage_trace('#chart')
