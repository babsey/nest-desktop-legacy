"use strict"

var kernelController = {};

kernelController.update = (options) => {
    if (!(options.id in app.data.kernel)) return
    var kernelElem = $('#kernel .content');
    var slider = kernelElem.find('#' + options.id);
    var sliderInput = slider.find('.' + options.id + 'Input');
    var value = app.data.kernel[options.id];
    var ticks_labels = sliderInput.data('ticks_labels');
    ticks_labels = ticks_labels ? JSON.parse(ticks_labels) : ticks_labels;
    value = ticks_labels ? ticks_labels.indexOf(value) : value;
    sliderInput.slider('setValue', parseFloat(value))
}

kernelController.updateAll = () => {
    var modelDefaults = app.config.nest('kernel');
    for (var midx in modelDefaults) {
        var options = modelDefaults[midx];
        kernelController.update(options)
    }
}

kernelController.init = () => {
    var kernelElem = $('#kernel .content');
    kernelElem.empty();
    var modelDefaults = app.config.nest('kernel');
    for (var idx in modelDefaults) {
        var options = modelDefaults[idx];
        app.slider.create_dataSlider('#kernel .content', options.id, options)
            .on('slideStop', function(d) {
                var kernelSlider = $(this).parents('.dataSlider');
                var id = kernelSlider.attr('id');
                var ticks_labels = JSON.parse($(this).data('ticks_labels'));
                var value = ticks_labels ? ticks_labels[d.value] : d.value;
                app.data.kernel[id] = parseFloat(value);
                kernelController.update({id: id, value: value})
                app.simulation.simulate.init()
            })
    }
    kernelController.updateAll()
}

module.exports = kernelController;
