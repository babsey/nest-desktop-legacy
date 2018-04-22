"use strict"

const math = require('mathjs');

var amplitude = {};

amplitude.update = (node) => {
    var dtime = node.amplitude_dtime || 1;
    var amplitude = node.amplitude_dvalue || 1;
    var endTime = node.params.stop || app.data.sim_time;
    node.params.amplitude_times = math.range(dtime, endTime, dtime)._data;
    node.params.amplitude_values = app.math.cumsum(Array(node.params.amplitude_times.length).fill(amplitude));
    app.slider.update_nodeSlider(node)
}

amplitude.init = (node) => {
    if (node.model != 'step_current_generator') return
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    amplitude.update(node);
    var options = nodeDefaults.amplitude_dtime;
    options.value = node.amplitude_dtime || options.value;
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.amplitude_dtime = d.value;
            amplitude.update(node);
            app.simulation.simulate.init()
        })
    nodeElem.find('#amplitude_dtimeVal').on('change', function() {
        var value = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(value, schema);
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        node.amplitude_dtime = valid.value;
        amplitude.update(node);
        app.simulation.simulate.init()
    })

    var options = nodeDefaults.amplitude_dvalue;
    options.value = node.amplitude_dvalue || options.value;
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.amplitude_dvalue = d.value;
            amplitude.update(node)
            app.simulation.simulate.init()
        })
    nodeElem.find('#amplitude_dvalueVal').on('change', function() {
        var pvalue = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(pvalue, schema);
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        node.amplitude_dvalue = valid.value;
        amplitude.update(node)
        app.simulation.simulate.init()
    })

    nodeElem.find('.amplitude_dtime .eraser').on('click', function() {
        var value = $(this).data('defaultValue');
        var key = $(this).parents('.paramSlider').attr('id');
        node.amplitude_dtime = value;
        amplitude.update(node)
        app.simulation.simulate.init()
    })

    nodeElem.find('.amplitude_dvalue .eraser').on('click', function() {
        var value = $(this).data('defaultValue');
        var key = $(this).parents('.paramSlider').attr('id');
        node.amplitude_dvalue = value;
        amplitude.update(node)
        app.simulation.simulate.init()
    })
}

module.exports = amplitude;
