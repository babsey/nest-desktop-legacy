"use strict"

var kernelController = {};

kernelController.init = function() {
    var kernelElem = $('#kernel .content')
    kernelElem.empty()
    var modelDefaults = app.config.nest('kernel')
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        model.value = app.data.kernel[model.id];
        app.slider.create_dataSlider('#kernel .content', model.id, model)
            .on('slideStop', function(d) {
                app.data.kernel[$(this).parents('.dataSlider').attr('id')] = d.value
                app.simulation.simulate()
            })
    }
}
module.exports = kernelController;
