"use strict"

var model = {};


model.node_selected = (node) => {
    $('#nodes').find('.node[data-id="' + node.id + '"]').find('.modelSelect .name').html(node.label);
    if (node.stim_time) {
        node.params.start = node.stim_time[0]
        if (node.stim_time[1] < app.data.sim_time) {
            node.params.stop = node.stim_time[1]
        }
    }
}

model.conn_selected = (link) => {
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all');
    $('#connections').find('.link[data-id="' + link.id + '"]').find('option#' + connRule).prop('selected', true);
}

model.syn_selected = (link) => {
    var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse');
    $('#synapses').find('.link[data-id="' + link.id + '"]').find('option#' + synapseModel).prop('selected', true);
}

model.get_recordables_list = (recorder) => {
    var nodeElem = $('#nodes').find('.node[data-id="' + recorder.id + '"] .content');
    var recObj = nodeElem.find('.record .dropdown-menu');
    recObj.empty()

    var sources = app.data.links.filter(
        (link) => link.target == recorder.id
    ).map(
        (link) => app.data.nodes[link.source].model
    );

    var dataModel = app.config.nest('data');
    if (sources.indexOf('iaf_cond_alpha_mc') != -1) {
        ['V_m', 'g_ex', 'g_in'].map((recId) => {
            var label = dataModel[recId].label;
            recObj.append('<li><a href="#" data-value="' + recId + '">' + label + '</a></li>')
            if (recId == recorder.data_from) {
                nodeElem.find('.record button').html(label)
            }
        })
    }
    if (sources.indexOf('hh_psc_alpha') != -1) {
        var recId = 'ct_';
        var label = dataModel[recId].label;
        recObj.append('<li><a href="#" data-value="' + recId + '">' + label + '</a></li>')
        if (recId == recorder.data_from) {
            nodeElem.find('.record button').html(label)
        }
    }
    if (recorder.params.record_from) {
        recorder.params.record_from.map((recId) => {
            var label = dataModel[recId].label;
            recObj.append('<li><a href="#" data-value="' + recId + '">' + label + '</a></li>')
            if (recId == recorder.data_from) {
                nodeElem.find('.record button').html(label)
            }
        })
    }
    nodeElem.find('.dataSelect .recSelect').show();
}

module.exports = model;
