"use strict"

var model = {};

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

    var dataModel = app.config.nest('data');
    if (sources.indexOf('iaf_cond_alpha_mc') != -1) {
        ['V_m', 'g_ex', 'g_in'].map((recId) => {
            var selected = (recId == recorder.data_from ? 'selected' : '');
            var label = dataModel[recId].label;
            recObj.append('<option value="' + recId + '" ' + selected + '>' + label + '</option>')
        })
    }
    if (sources.indexOf('hh_psc_alpha') != -1) {
        var recId = 'ct_';
        var selected = (recId == recorder.data_from ? 'selected' : '');
        var label = dataModel[recId].label;
        recObj.append('<option value="' + recId + '" ' + selected + '>' + label + '</option>')
    }
    if (recorder.params.record_from) {
        recorder.params.record_from.map((recId) => {
            var selected = (recId == recorder.data_from ? 'selected' : '');
            var label = dataModel[recId].label;
            recObj.append('<option value="' + recId + '" ' + selected + '>' + label + '</option>')
        })
    }
    $('#recorder').show();
}

module.exports = model;
