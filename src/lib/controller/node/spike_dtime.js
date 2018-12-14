"use strict"

const math = require('mathjs');
const numeric = require('numeric');

var nodeController = {};

nodeController.spike_dtime = (node) => {
    if (node.model != 'spike_generator') return
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    var spike_dtime = node.spike_dtime || nodeDefaults.spike_dtime.value;
    var spike_weight = node.spike_weight || nodeDefaults.spike_weight.value;
    node.params.spike_times = math.range(spike_dtime, app.data.sim_time, spike_dtime)._data;
    node.params.spike_weights = numeric.rep([node.params.spike_times.length], spike_weight);

    var options = nodeDefaults.spike_dtime;
    options.value = node.spike_dtime;
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.spike_dtime = d.value;
            node.params.spike_times = math.range(node.spike_dtime, app.data.sim_time, node.spike_dtime)._data;
            node.params.spike_weights = numeric.rep([node.params.spike_times.length], node.spike_weight || nodeDefaults.spike_weight.value);
            app.simulation.simulate.init()
        })
    nodeElem.find('#spike_dtimeVal').on('change', function() {
        var value = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(value, schema);
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        node.spike_dtime = valid.value;
        node.params.spike_times = math.range(node.spike_dtime, app.data.sim_time, node.spike_dtime)._data;
        node.params.spike_weights = numeric.rep([node.params.spike_times.length], node.spike_weight || nodeDefaults.spike_weight.value);
        app.simulation.simulate.init()
    })

    nodeElem.find('.spike_dtime .eraser').on('click', function() {
        var value = $(this).data('defaultValue');
        node.spike_dtime = value;
        node.params.spike_times = math.range(node.spike_dtime, app.data.sim_time, node.spike_dtime)._data;
        node.params.spike_weights = numeric.rep([node.params.spike_times.length], node.spike_weight || nodeDefaults.spike_weight.value);
        app.simulation.simulate.init()
    })
}

module.exports = nodeController;
