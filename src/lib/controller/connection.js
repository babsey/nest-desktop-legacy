"use strict"

var connController = {};

connController.update = (link) => {
    if (link.disabled) return
    app.model.conn_selected(link)
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all');
    var modelDefaults = app.config.nest('connection');
    var connElem = $('#connections').find('.link[data-id=' + link.id + '] .content');
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
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        connElem.find('.connSelect .dropdown-menu').append('<li><a href="#" data-rule="' + model.id + '" data-label="' + model.label +'">' + model.label + '</a></li>')
        if (model.id == connRule)
            connElem.find('.modelSelect .name').html(model.label);
    }
    connElem.find('.connSelect').toggleClass('disabled', link.disabled || false)
    connElem.find('.linkConfig .enabled').toggle(!link.disabled && true)
    connElem.find('.linkConfig .disabled').toggle(link.disabled || false)
    
    connElem.find('.connSelect .dropdown-menu a').on('click', (d) => {
        var modelElem = $(d.currentTarget)
        link.conn_spec = {
            rule: modelElem.data('rule')
        };
        connElem.find('.modelSelect .name').html(modelElem.data('label'));
        connController.update(link)
        app.simulation.simulate.init()
    })

    connElem.find('.resetParameters').on('click', () => {
        link.conn_spec = 'all_to_all';
        connElem.find('.modelSelect .name').html('All to all');
        connController.update(link)
        app.simulation.simulate.init()
    })

    connElem.find('.disableLink').on('click', () => {
        app.data.kernel.time = 0.0 // Reset simulation
        link.disabled = !link.disabled;
        app.simulation.reload()
    })

    connElem.find('.deleteLink').on('click', (d) => {
        app.data.kernel.time = 0.0 // Reset simulation
        var linkId = $(d.currentTarget).parents('.link').data('id');

        if (app.selected_link) {
            app.selected_link = app.selected_link.id == linkId ? null : app.selected_link;
        }

        var links = app.data.links.filter((d) => (d.id != linkId));
        links.map((d, i) => {
            d.id = i;
        })
        app.data.links = links;
        app.simulation.reload()
    })

    connController.update(link)
}

module.exports = connController;
