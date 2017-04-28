"use strict"

var simulationController = {};

simulationController.update = function() {
    var simElem = $('#simulation .content')
    simElem.find('#abscissaSelect').empty()
    simElem.find('#abscissaSelect').append('<option value="times">' + app.model.record_labels.times + '</option>')
    app.simulation.stimulators.map(function(stimulator) {
        if (!stimulator.events) return
        Object.keys(stimulator.events).map(function(key) {
            simElem.find('#abscissaSelect').append('<option value="' + key + '">' + app.model.record_labels[key] + '</option>')
            app.chart.data[key] = stimulator.events[key];
        })

        simElem.find('#abscissaSelect').on('change', function() {
            $('#autoscale').prop('checked', 'checked')
            $("#simulation-resume").toggleClass('disabled', app.chart.abscissa == 'times')
            app.chart.abscissa = this.value;
            app.chart.update()
        })
    })
    simElem.find('#abscissaSelect').val(app.chart.abscissa)
    simElem.find('#abscissa').toggle(simElem.find('#abscissaSelect option').length > 1)
    $("#simulation-resume").toggleClass('disabled', app.chart.abscissa != 'times')
}

simulationController.init = function() {
    var simElem = $('#simulation .content')
    simElem.empty()
    var modelDefaults = app.config.nest('simulation')
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        model.value = app.data[model.id];
        app.slider.create_dataSlider('#simulation .content', model.id, model)
            .on('slideStop', function(d) {
                app.data[$(this).parents('.dataSlider').attr('id')] = d.value
                app.simulation.simulate()
            })
    }
    simElem.find('input.paramVal').on('change', function() {
        var pkey = $(this).parents('.dataSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        app.data[pkey] = valid.value
        app.slider.update_dataSlider()
        app.simulation.simulate()
    })

    simElem.append('<div id="abscissa" class="form-group hideOnDrawing" style="display:none"></div>')
    simElem.find('#abscissa').append('<label for="abscissaSelect">Abscissa</label>')
    simElem.find('#abscissa').append('<select id="abscissaSelect" class="form-control"></select>')
    simElem.find('#abscissaSelect').append('<option value="times">' + app.model.record_labels.times + '</option>')
    simElem.find('#abscissa').toggle(simElem.find('#abscissaSelect option').length > 1)
    $("#simulation-resume").toggleClass('disabled', app.chart.abscissa != 'times')
}
module.exports = simulationController;
