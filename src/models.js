"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');
var slider = require('./slider');

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')

var record_labels = {
    'g_ex': 'Conductance',
    'g_in': 'Conductance',
    'input_currents_ex': 'Current (pA)',
    'input_currents_in': 'Current (pA)',
    'V_m': 'Membrane pontential (mV)',
    'V_th': 'Spike threshold (mV)',
    'weighted_spikes_ex': 'Spikes',
    'weighted_spikes_in': 'Spikes',
}

var recordables = {}
function load_model_list(nodes) {
    d3Request.csv('file://' + curpath + '/settings/models.csv', function(models) {
        models.forEach(function(model) {
            if (model.recordables) {
                recordables[model.name] = model.recordables.split(';');
            }
            $("<option class='modelSelect' id='" + model.name +"' value=" + model.name + ">" + model.label + "</option>").appendTo("#id_" + model.type)
            slider.init_paramSlider(model.type, model.name)
        })
        setTimeout(function () {$('.paramSlider').hide()},100)
    })
}

function model_selected(node) {
    var model = node.model;
    node.params = {};
    if (node.type == 'neuron') {
        $('#id_record').empty()
        for (var recId in recordables[model]) {
            var rec = recordables[model][recId];
            $('<option val="' + rec + '">' + rec + '</option>').appendTo('#id_record')

        }
        node.record_from = $('#id_record option:selected').val();
        $('#record').show();
    }
}

module.exports = {
    record_labels: record_labels,
    load_model_list: load_model_list,
    model_selected: model_selected,
}
