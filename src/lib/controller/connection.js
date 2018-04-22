"use strict"

var connController = {};

connController.update = (link) => {
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    var modelDefaults = app.config.nest('connection');
    var connElem = $('#connections').find('.link[data-id=' + link.id + '] .content')
    app.slider.init_modelSlider('#connections .link[data-id=' + link.id + '] .modelSlider',
        modelDefaults.filter((d) => d.id == connRule)[0])
    app.slider.update_connSlider(link)
    connElem.find('.modelSlider .sliderInput').on('slideStop', function() {
        var param = $(this).parents('.paramSlider').attr('id');
        link.conn_spec[param] = parseFloat(this.value)
        app.simulation.simulate.init()
    })
    connElem.find('input.paramVal').addClass('disableOnRunning')
    connElem.find('input.paramVal').on('change', function() {
        var value = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(value, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        var key = $(this).parents('.paramSlider').attr('id');
        link.conn_spec[key] = valid.value;
        app.slider.update_connSlider(link)
        app.simulation.simulate.init()
    })

    connElem.find('.paramSlider .eraser').on('click', function() {
        var key = $(this).parents('.paramSlider').attr('id');
        var value = $(this).data('defaultValue');
        link.conn_spec[key] = value;
        app.simulation.simulate.init()
    })
}

connController.init = (link) => {
    // Connection
    $('#connections .controller').append(app.renderer.link.controller.connection(link))
    var connElem = $('#connections').find('.link[data-id=' + link.id + ']')
    var modelDefaults = app.config.nest('connection');
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        connElem.find('.connSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
    }
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    connElem.find('.connSelect').find('option#' + connRule).prop('selected', true);
    connElem.find('.connSelect').on('change', function() {
        link.conn_spec = {
            rule: this.value
        };
        app.model.conn_selected(link)
        connController.update(link)
        app.simulation.simulate.init()
    })

    connElem.find('.connSelect').toggleClass('disabled', link.disabled || false)
    connElem.find('.glyphicon-remove').toggle(link.disabled || false)
    connElem.find('.glyphicon-ok').toggle(!link.disabled && true)
    connElem.find('.disableLink').on('click', () => {
        app.data.kernel.time = 0.0 // Reset simulation
        link.disabled = !link.disabled;
        var disabled = link.disabled || false
        app.simulation.reload()
    })
    if (link.disabled) return
    connController.update(link)
}

module.exports = connController;
