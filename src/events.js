"use strict"

var $ = require('jquery');
var models = require("./models");
var slider = require("./slider");

function eventHandler(data, simulate) {
    $('.paramSlider .sliderInput').on('slideStop', function() {
        window.selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        var model = this.value;
        window.selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.model = model;
        selected_node.params = {};
        models.model_selected(selected_node)
        slider.update_paramSlider(selected_node)
        setTimeout(simulate, 100)
    })
    $('.network').on('click', function() {
        setTimeout(simulate, 100)
    })
}

module.exports = {
    eventHandler: eventHandler
}
