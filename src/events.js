"use strict"

var $ = require('jquery');
var models = require("./models");
var slider = require("./slider");
window.running = false;

function eventHandler(data, simulate, resume) {
    $('.paramSlider .sliderInput').on('slideStop', function() {
        window.selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        running = false
        var model = this.value;
        window.selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.model = model;
        selected_node.params = {};
        models.model_selected(selected_node)
        slider.update_paramSlider(selected_node)
        setTimeout(simulate, 100)
    })
    $('.network').on('click', function() {
        running = false
        setTimeout(simulate, 100)
    })
    $('#index').on('click', function() {
        running = false
        setTimeout(function() {
            window.location = "../index.html"
        }, 100)
    })
    $('#close').on('click', function() {
        running = false
        setTimeout(function() {
            window.close()
        }, 100)
    })
    if (resume) {
        $('#network-resume').on('click', function() {
            if (running) {
                $('#network-resume').find('.glyphicon').hide()
                $('#network-resume').find('.glyphicon-play').show()
                $('.dataSlider').find('.sliderInput').slider('enable')
                running = false
            } else {
                $('#network-resume').find('.glyphicon').hide()
                $('#network-resume').find('.glyphicon-pause').show()
                $('.dataSlider').find('.sliderInput').slider('disable')
                running = true
                resume()
            }
        })
    }
}



module.exports = {
    eventHandler: eventHandler
}
