"use strict"

var model = {};
model.record_labels = {
    'g_ex': 'Conductance of excitatory input',
    'g_in': 'Conductance of inhibitory input',
    'input_currents_ex': 'Current of excitatory input (pA)',
    'input_currents_in': 'Current of excitatory input (pA)',
    'V_m': 'Membrane pontential (mV)',
    'V_th': 'Spike threshold (mV)',
    'weighted_spikes_ex': 'Spikes of excitatory input',
    'weighted_spikes_in': 'Spikes of inhibitory input',
    'Act_m': 'Activation m',
    'Act_h': 'Activation h',
    'Inact_n': 'Inactivation n',
    'V_m.d': 'Distal membrane pontential (mV)',
    'V_m.p': 'Proximal membrane pontential (mV)',
    'V_m.s': 'Soma membrane pontential (mV)',
    'g_ex.d': 'Distal conductance of excitatory input',
    'g_ex.p': 'Proximal conductance of excitatory input',
    'g_ex.s': 'Soma conductance of excitatory input',
    'g_in.d': 'Distal conductance of inhibitory input',
    'g_in.p': 'Proximal conductance of inhibitory input',
    'g_in.s': 'Soma conductance of inhibitory input',
    't_ref_remain': 'Remaining refactory time (s)',
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

model.get_recordables_list = function(recorder) {
    var recObj = $('#node_' + recorder.id).find('.record')
    recObj.empty()

    var sources = app.data.links.filter(function(link) {
        return link.target == recorder.id
    }).map(function(link) {
        return app.data.nodes[link.source].model
    })

    if (sources.indexOf('iaf_cond_alpha_mc') != -1) {
        ['V_m', 'g_ex', 'g_in'].map(function(rec) {
            recObj.append('<option value="' + rec + '" ' + (rec == recorder.record_from ? 'selected' : '') + '>' + (model.record_labels[rec] || rec) + '</option>')
        })
    }
    for (var recId in recorder.params.record_from) {
        var rec = recorder.params.record_from[recId];

        recObj.append('<option value="' + rec + '" ' + (rec == recorder.record_from ? 'selected' : '') + '>' + (model.record_labels[rec] || rec) + '</option>')
    }
    $('#recorder').show();
}

module.exports = model;
