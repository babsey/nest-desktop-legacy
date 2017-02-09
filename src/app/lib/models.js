"use strict"

const $ = require('jquery');
const slider = require('./slider');
var config = require('../config');

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

function load_model_list() {
    var modelTypes = ['input', 'neuron'];
    for (var idx in modelTypes) {
        var modelDefaults = config.models(modelTypes[idx])
        for (var idx in modelDefaults) {
            var model = modelDefaults[idx];
            $("<option class='modelSelect' id='" + model.id + "' value=" + model.id + ">" + model.label + "</option>").appendTo("." + model.type + 'Select')
            slider.init_paramSlider(model)
        }
    }
    setTimeout(function() {
        $('.paramSlider').hide()
    }, 100)
}

function model_selected(node) {
    $('#node_' + node.id).find('option#' + node.model).prop('selected', true);
    if (node.stim_time) {
        node.params.start = node.stim_time[0]
        if (node.stim_time[1] < data.sim_time) {
            node.params.stop = node.stim_time[1]
        }
    }
}

function get_recordables_list(output) {
    $('#id_record').empty()
    for (var recId in output.params.record_from) {
        var rec = output.params.record_from[recId];
        $('<option val="' + rec + '" ' + (rec == output.record_from ? 'selected' : '') + '>' + rec + '</option>').appendTo('#id_record')
    }
    $('#output').show();
}

module.exports = {
    record_labels: record_labels,
    load_model_list: load_model_list,
    model_selected: model_selected,
    get_recordables_list: get_recordables_list,
}
