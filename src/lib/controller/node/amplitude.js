"use strict"

var nodeController = {};

nodeController._amplitude = (dtime, dvalue) => {
    var times = math.range(dtime, app.data.sim_time, dtime)._data;
    var amplitudes = math.range(dvalue, dvalue * (times.length + 10), dvalue)._data;
    return {
        times: times,
        values: amplitudes.slice(0, times.length)
    }
}

nodeController.amplitude = (node) => {
    if (node.model != 'step_current_generator') return

    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
    var amplitude_dvalue = (node.amplitude_dvalue || nodeDefaults.amplitude_dvalue.value);
    var amplitude = nodeController._amplitude(amplitude_dtime, amplitude_dvalue);
    node.params.amplitude_times = amplitude.times;
    node.params.amplitude_values = amplitude.values;

    var options = nodeDefaults.amplitude_dtime;
    options.value = amplitude_dtime;
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.amplitude_dtime = d.value;
            var amplitude_dvalue = (node.amplitude_dvalue || nodeDefaults.amplitude_dvalue.value);
            var amplitude = nodeController._amplitude(node.amplitude_dtime, amplitude_dvalue);
            node.params.amplitude_times = amplitude.times;
            node.params.amplitude_values = amplitude.values;
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
        var amplitude_dvalue = (node.amplitude_dvalue || nodeDefaults.amplitude_dvalue.value);
        var amplitude = nodeController._amplitude(node.amplitude_dtime, amplitude_dvalue);
        node.params.amplitude_times = amplitude.times;
        node.params.amplitude_values = amplitude.values;
        app.slider.update_nodeSlider(node)
        app.simulation.simulate.init()
    })

    var options = nodeDefaults.amplitude_dvalue;
    options.value = amplitude_dvalue;
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.amplitude_dvalue = d.value;
            var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
            var amplitude = nodeController._amplitude(amplitude_dtime, node.amplitude_dvalue)
            node.params.amplitude_times = amplitude.times;
            node.params.amplitude_values = amplitude.values;
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
        var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
        var amplitude = nodeController._amplitude(amplitude_dtime, node.amplitude_dvalue)
        node.params.amplitude_times = amplitude.times;
        node.params.amplitude_values = amplitude.values;
        app.slider.update_nodeSlider(node)
        app.simulation.simulate.init()
    })
}

module.exports = nodeController;
