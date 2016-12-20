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
                recordables[model.id] = model.recordables.split(';');
            }
            $("<option class='model_select' value=" + model.id + ">" + model.label + "</option>").appendTo("#id_" + model.type)
            slider.create_modelslider(nodes, model.type, model.id)
        })
        setTimeout(function () {$('.modelSlider').hide()},100)
    })
}

function model_select_onChange(nodes, level) {
    $('.model_select').on('change', function() {
        var node = $(this).parents('.model').attr('id');
        var model = this.value;

        nodes[node].model = model;
        nodes[node].params = {};
        if (node == 'neuron') {
            var neuron = nodes.neuron;
            $('#id_record').empty()
            for (var recId in recordables[model]) {
                var rec = recordables[model][recId];
                $('<option val="' + rec + '">' + rec + '</option>').appendTo('#id_record')

            }
            neuron.record_from = $('#id_record option:selected').val();
            $('#record').show();
        }
    })
}

module.exports = {
    record_labels: record_labels,
    load_model_list: load_model_list,
    model_select_onChange: model_select_onChange,
}
