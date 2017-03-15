"use strict"

var model = {};
model.record_labels = {
    'g_ex': 'Conductance',
    'g_in': 'Conductance',
    'input_currents_ex': 'Current (pA)',
    'input_currents_in': 'Current (pA)',
    'V_m': 'Membrane pontential (mV)',
    'V_th': 'Spike threshold (mV)',
    'weighted_spikes_ex': 'Spikes',
    'weighted_spikes_in': 'Spikes',
}

model.node_selected = function(node) {
    $('#node_' + node.id).find('option#' + node.model).prop('selected', true);
    if (node.stim_time) {
        node.params.start = node.stim_time[0]
        if (node.stim_time[1] < app.data.sim_time) {
            node.params.stop = node.stim_time[1]
        }
    }
}

model.conn_selected = function(link) {
    $('#link_' + link.id).find('option#' + (link.conn_spec.rule || 'all_to_all')).prop('selected', true);
}

model.syn_selected = function(link) {
    $('#link_' + link.id).find('option#' + (link.syn_spec.model || 'static_synapse')).prop('selected', true);
}

model.get_recordables_list = function(output) {
    $('.record').empty()
    for (var recId in output.params.record_from) {
        var rec = output.params.record_from[recId];
        $('.record').append('<option val="' + rec + '" ' + (rec == output.record_from ? 'selected' : '') + '>' + rec + '</option>')
    }
    $('#output').show();
}

module.exports = model;
