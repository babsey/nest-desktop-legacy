"use strict"

var model = {};

model.record_labels = {
    'g_ex': 'Excitatory conductance (nS)',
    'g_in': 'Inhibitory conductance (nS)',
    'currents': 'Currents (pA)',
    'input_currents_ex': 'Incoming excitatory currents (pA)',
    'input_currents_in': 'Incoming inhibitory currents (pA)',
    'I_syn_ex': 'Total excitatory synaptic current (pA)',
    'I_syn_in': 'Total inhibitory synaptic current (pA)',
    'ct_': 'Activation of conductances',
    'Act_m': 'Activation of Na+ conductance',
    'Act_h': 'Inactivation of Na+ conductance',
    'Inact_n': 'Activation of K+ conductance',
    'V_m.d': 'Distal membrane pontential (mV)',
    'V_m.p': 'Proximal membrane pontential (mV)',
    'V_m.s': 'Soma membrane pontential (mV)',
    'g_ex.d': 'Distal conductance of excitatory input',
    'g_ex.p': 'Proximal conductance of excitatory input',
    'g_ex.s': 'Soma conductance of excitatory input',
    'g_in.d': 'Distal conductance of inhibitory input',
    'g_in.p': 'Proximal conductance of inhibitory input',
    'g_in.s': 'Soma conductance of inhibitory input',
    'count': 'Spike counts',
    'rate': 'Firing rate [spikes/sec]',
    't_ref_remaining': 'Time remaining till end of refractory state (s)',
    'times': 'Time (ms)',
    'V_m': 'Membrane pontential (mV)',
    'V_th': 'Spike threshold (mV)',
    'weighted_spikes_ex': 'Weighted incoming excitatory spikes',
    'weighted_spikes_in': 'Weighted incoming inhibitory spikes',
}

model.record_legends = {
    'Act_m': 'Activation of Na+ conductance',
    'Act_h': 'Inactivation of Na+ conductance',
    'Inact_n': 'Activation of K+ conductance',
    'V_m.d': 'Distal',
    'V_m.p': 'Proximal',
    'V_m.s': 'Soma',
    'g_ex.d': 'Distal',
    'g_ex.p': 'Proximal',
    'g_ex.s': 'Soma',
    'g_in.d': 'Distal',
    'g_in.p': 'Proximal',
    'g_in.s': 'Soma',
}

model.node_selected = (node) => {
    $('#node_' + node.id).find('option#' + node.model).prop('selected', true);
    if (node.stim_time) {
        node.params.start = node.stim_time[0]
        if (node.stim_time[1] < app.data.sim_time) {
            node.params.stop = node.stim_time[1]
        }
    }
}

model.conn_selected = (link) => {
    $('#link_' + link.id).find('option#' + (link.conn_spec.rule || 'all_to_all')).prop('selected', true);
}

model.syn_selected = (link) => {
    $('#link_' + link.id).find('option#' + (link.syn_spec.model || 'static_synapse')).prop('selected', true);
}

model.get_recordables_list = (recorder) => {
    var recObj = $('#node_' + recorder.id).find('.record')
    recObj.empty()

    var sources = app.data.links.filter(
        (link) => link.target == recorder.id
    ).map(
        (link) => app.data.nodes[link.source].model
    );

    if (sources.indexOf('iaf_cond_alpha_mc') != -1) {
        ['V_m', 'g_ex', 'g_in'].map((rec) => {
            recObj.append('<option value="' + rec + '" ' + (rec == recorder.record_from ? 'selected' : '') + '>' + (model.record_labels[rec] || rec) + '</option>')
        })
    }
    if (sources.indexOf('hh_psc_alpha') != -1) {
        var rec = 'ct_'
        recObj.append('<option value="' + rec + '" ' + (rec == recorder.record_from ? 'selected' : '') + '>' + (model.record_labels[rec] || rec) + '</option>')
    }
    for (var recId in recorder.params.record_from) {
        var rec = recorder.params.record_from[recId];

        recObj.append('<option value="' + rec + '" ' + (rec == recorder.record_from ? 'selected' : '') + '>' + (model.record_labels[rec] || rec) + '</option>')
    }
    $('#recorder').show();
}

module.exports = model;
