"use strict"

var kernelController = {};

kernelController.init = function() {
    var kernelElem = $('#kernel .content')
    kernelElem.empty()
    var modelDefaults = app.config.nest('kernel');
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        app.slider.create_dataSlider('#kernel .content', model.id, model)
            .on('slideStop', function(d) {
                var value = model.ticks_labels[d.value] || d.value;
                app.data.kernel[$(this).parents('.dataSlider').attr('id')] = value;
                app.simulation.simulate()
            })
    }
    kernelElem.find('input.paramVal').on('change', function() {
        var pkey = $(this).parents('.dataSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        app.data.kernel[pkey] = valid.value
        app.slider.update_kernelSlider()
        app.simulation.simulate()
    })
    app.slider.update_kernelSlider()
}
module.exports = kernelController;
