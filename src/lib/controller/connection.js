"use strict"

var connController = {};

connController.update = function(link) {
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    var modelDefaults = app.config.nest('connection');
    var connElem = $('#connections').find('.link[data-id=' + link.id + '] .content')
    app.slider.init_modelSlider('#connections .link[data-id=' + link.id + '] .modelSlider', modelDefaults.filter(function(d) {
        return d.id == connRule;
    })[0])
    app.slider.update_connSlider(link)
    connElem.find('.modelSlider .sliderInput').on('slideStop', function() {
        app.selected_node = null;
        app.selected_link = link;
        var param = $(this).parents('.paramSlider').attr('id');
        link.conn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
        app.simulation.simulate()
    })
    connElem.find('input.paramVal').on('change', function() {
        app.selected_node = null;
        app.selected_link = link;
        var pkey = $(this).parents('.paramSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        link.conn_spec[pkey] = valid.value
        app.slider.update_connSlider(link)
        app.simulation.simulate()
    })
}

connController.init = function(link) {
    // Connection
    $('#connections .controller').append(app.renderer.connection(link))
    var connElem = $('#connections').find('.link[data-id=' + link.id + ']')
    var modelDefaults = app.config.nest('connection');
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        connElem.find('.connSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
    }
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    connElem.find('.connSelect').find('option#' + connRule).prop('selected', true);
    connElem.find('.connSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_node = null;
        app.selected_link = link;
        link.conn_spec = {
            rule: this.value
        };
        app.model.conn_selected(link)
        connController.update(link)
        app.simulation.simulate()
    })

    connElem.find('.connSelect').toggleClass('disabled', link.disabled || false)
    connElem.find('.glyphicon-remove').toggle(link.disabled || false)
    connElem.find('.glyphicon-ok').toggle(!link.disabled && true)
    connElem.find('.disableLink').on('click', function() {
        app.simulation.run(false)
        app.selected_node = null;
        app.selected_link = link;
        link.disabled = !link.disabled;
        var disabled = link.disabled || false
        app.simulation.update()
    })
    if (link.disabled) return
    connController.update(link)
}

module.exports = connController;
