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
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        var param = $(this).parents('.paramSlider').attr('id');
        app.selected_link.conn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
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
        app.selected_link = link;
        app.selected_link.conn_spec = {
            rule: this.value
        };
        app.model.conn_selected(app.selected_link)
        connController.update(link)
        app.simulation.simulate()
    })

    connElem.find('.connSelect').toggleClass('disabled', link.disabled || false)
    connElem.find('.glyphicon-remove').toggle(link.disabled || false)
    connElem.find('.glyphicon-ok').toggle(!link.disabled && true)
    connElem.find('.disableLink').on('click', function() {
        app.simulation.run(false)
        var link = app.data.links[$(this).parents('.link').data('id')]
        link.disabled = !link.disabled;
        var disabled = link.disabled || false
        app.simulation.update()
    })
    if (link.disabled) return
    connController.update(link)
}

module.exports = connController;
