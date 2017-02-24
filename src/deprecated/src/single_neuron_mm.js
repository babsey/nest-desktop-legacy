"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');

var s = require("./slider");
var req = require('./request');
var ts = require('./traces');


var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')
nodes = {};
var recordables = {};
var record_from = 'V_m'

var recordLabels = {
    'V_m': 'Membrane pontential (ms)',
    'g_ex': 'Conductance',
    'g_in': 'Conductance',
    'input_currents_ex': 'Current (pA)',
    'input_currents_in': 'Current (pA)',
    'weighted_spikes_ex': 'Spikes',
    'weighted_spikes_in': 'Spikes',
}


d3Request.csv('file://' + curpath + '/settings/models.csv', function(models) {

    models.forEach(function(model) {
        if (model.recordables) {
            recordables[model.id] = model.recordables.split(';');
        }
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
                ts.update(data.events.times, data.events[record_from], data.time, data.pop, recordLabels[record_from]);
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
    var model = this.value;
    nodes[node] = {
        'model': model,
        'params': {}
    }
    if (node == 'neuron') {
        $('#id_record').empty()
        for (var recId in recordables[model]) {
            var rec = recordables[model][recId];
            $('<option val="' + rec + '">' + rec + '</option>').appendTo('#id_record')

        }
        record_from = $('#id_record option:selected').val();
        $('#record').show();
    }
    update_params(node, model)
    simulate(1000.)
})

$('#id_record').on('change', function() {
    record_from = this.value;
    ts.update(data.events.times, data.events[record_from], data.time, data.pop, recordLabels[record_from]);
})

ts.traces('#chart')
