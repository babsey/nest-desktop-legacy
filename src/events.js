"use strict"

window.$ = window.jQuery = require('jquery');
var models = require("./models");
var slider = require("./slider");

// selected_node and selected_link are global variables.
selected_node = null;
selected_link = null;

function eventHandler(data, simulate, update_dataSlider) {
    $('.paramSlider .sliderInput').on('slideStop', function() {
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        var model = this.value;
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.model = model;
        models.model_selected(selected_node)
        slider.update_paramSlider(selected_node, data.level)
        setTimeout(simulate, 100)
    })
    $('.network').on('click', function() {
        setTimeout(simulate, 100)
    })
}

module.exports = {
    eventHandler: eventHandler
}
