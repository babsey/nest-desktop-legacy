"use strict"

var nodeController = {};

nodeController.params = (node) => {
    if (node.element_type == 'recorder') return
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    var colors = app.chart.colors();
    nodeElem.find('.slider-selection').css('background', colors[node.id % colors.length])
    nodeElem.find('.slider-handle').css('border', '2px solid ' + colors[node.id % colors.length])
    nodeElem.find('input.stim_timeVal').addClass('disableOnRunning')

    nodeElem.find('.modelSlider').empty()
    var modelDefaults = app.config.nest(node.element_type);
    app.slider.init_modelSlider('#nodes .node[data-id=' + node.id + '] .modelSlider',
        modelDefaults.filter((d) => d.id == node.model)[0])
    nodeElem.find('.modelSlider .sliderInput').on('slideStop', function(d) {
        var ticks_labels = $(this).data('ticks_labels');
        ticks_labels = ticks_labels ? JSON.parse(ticks_labels) : ticks_labels;
        var value = ticks_labels ? ticks_labels[d.value] : d.value;
        var node = app.data.nodes[$(this).parents('.node').data('id')];
        var pkey = $(this).parents('.paramSlider').attr('id');
        node.params[pkey] = value;
        app.simulation.simulate.init()
    })
    if (modelDefaults.params) {
        modelDefaults.params.map((param) => {
            nodeElem.find('.modelSlider').append('<div id="' + param.id + '" class="form-group"></div>')
            nodeElem.find('#' + param.id).append('<label for="' + param.id + 'Input"/>' + param.label + '</label>')
            nodeElem.find('#' + param.id).append('<input type="text" class="form-control" name="' + param.id + '" id="' + param.id + 'Input"/>')
        })
    }
    nodeElem.find('.modelSlider input.paramVal').on('change', function() {
        var value = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(value, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        var key = $(this).parents('.paramSlider').attr('id');
        node.params[key] = valid.value
        app.slider.update_nodeSlider(node)
        app.simulation.simulate.init()
    })
}

module.exports = nodeController;
