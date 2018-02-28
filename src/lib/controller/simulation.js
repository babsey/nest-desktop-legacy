"use strict"

var simulationController = {};

simulationController.update = (options) => {
    if (!(options.id in app.data)) return
    var simElem = $('#simulation .content');
    var simulationSlider = simElem.find('#' + options.id);
    var value = app.data[options.id];
    simulationSlider.find('.' + options.id + 'Input').slider('setValue', parseFloat(value));
    simulationSlider.find('.' + options.id + 'Val').val(value);
}

simulationController.updateAll = () => {
    var dataModel = app.config.nest('data');
    var simElem = $('#simulation .content')
    simElem.find('.dataSlider').each(function() {
        simulationController.update({'id': this.id})
    })
}

simulationController.init = () => {
    var simElem = $('#simulation .content');
    simElem.empty();
    var modelDefaults = app.config.nest('simulation');
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        model.value = app.data[model.id];
        app.slider.create_dataSlider('#simulation .content', model.id, model)
            .on('slideStop', function(d) {
                var simulationSlider = $(this).parents('.dataSlider');
                var id = simulationSlider.attr('id');
                if (id == 'random_seed') {
                    app.config.randomSeed(false)
                }
                app.data[id] = d.value;
                app.simulation.simulate.init()
            })
    }
    simElem.find('input.paramVal').on('change', function() {
        var simulationSlider = $(this).parents('.dataSlider');
        var value = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(value, schema);
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        var id = simulationSlider.attr('id');
        if (id == 'random_seed') {
            app.config.randomSeed(false)
        }
        app.data[id] = valid.value;
        simulationSlider.find('.' + id + 'Input').slider('setValue', valid.value)
        app.simulation.simulate.init()
    })

}

module.exports = simulationController;
