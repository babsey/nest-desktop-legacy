"use strict"

var nodeController = {};

nodeController.stim_time = (node) => {
    if (node.element_type != 'stimulator') return
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    var options = nodeDefaults.stim_time;
    options.max = app.data.sim_time;
    options.value = [(node.params.start || 0), (node.params.stop || app.data.sim_time)]
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            node.params.start = d.value[0];
            delete node.params.stop
            if (d.value[1] < app.data.sim_time) {
                node.params.stop = d.value[1];
            }
            if (node.model == 'step_current_generator') {
                app.controller.node.amplitude.update(node)
            }
            app.simulation.simulate.init()
        })
    nodeElem.find('#stim_timeVal').on('change', function() {
        var valuesInput = $(this).val();
        var values = valuesInput.slice(1,valuesInput.length-1).split(',');
        for (var idx in values) {
            var value = values[idx];
            var valid = app.validation.validate(value, 'number')
            $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
            $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
            $(this).parents('.form-group').find('.help-block').html(valid.error)
            if (valid.error != null) return
        }
        var start = parseFloat(values[0]);
        var stop = parseFloat(values[1]);
        if (stop <= start) {
            $(this).parents('.form-group').find('.help-block').html('Start value should be smaller that stop value.')
            return
        }
        node.params.start = start;
        node.params.stop = stop;
        app.slider.update_dataSlider(node, 'stim_time', [start, stop], valuesInput)
        if (node.model == 'step_current_generator') {
            app.controller.node.amplitude.update(node)
        }
        app.simulation.simulate.init()
    })

    nodeElem.find('.stim_time .eraser').on('click', function() {
        var values = $(this).data('defaultValue');
        node.params.start = parseFloat(values[0]);
        node.params.stop = parseFloat(values[1]);
        if (node.model == 'step_current_generator') {
            app.controller.node.amplitude.update(node)
        }
        app.simulation.simulate.init()
    })
}

module.exports = nodeController;
