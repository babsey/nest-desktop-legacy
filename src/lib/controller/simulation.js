"use strict"

var simulationController = {};

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

    simElem.append('<div id="abscissa" class="form-group hideOnDrawing"></div>')
    simElem.find('#abscissa').append('<label for="abscissaSelect">Abscissa</label>')
    simElem.find('#abscissa').append('<select id="abscissaSelect" class="form-control"></select>')
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
    $("#simulation-resume").toggleClass('disabled', app.chart.abscissa != 'times')
}
module.exports = simulationController;
