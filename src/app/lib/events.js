"use strict"

var config_global = require('../config').global();

function eventHandler(simulate, resume, update) {
    if (window.layout) {
        $('.model').on('mouseover', function() {
            window.selected_node = data.nodes[$(this).attr('nidx')];
            window.selected_link = null;
            layout.restart()
        }).on('mouseout', function() {
            window.selected_node = null;
            layout.restart()
        })
    }
    $('.paramSlider .sliderInput').on('slideStop', function() {
        window.selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        if ($(this).parents('.model').attr('id') == 'output') return
        if ((data.nodes[0].model != undefined) && (data.nodes[1].model != undefined)) {
            $('#network-add').attr('disabled', false)
        }
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        if ((data.nodes[0].model != undefined) && (data.nodes[1].model != undefined)) {
            $('#network-add').attr('disabled', false)
        }
        app.navigation.run(false)
        var model = this.value;
        window.selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.model = model;
        selected_node.params = {};
        app.models.model_selected(selected_node)
        app.slider.update_paramSlider(selected_node)
        setTimeout(simulate, 100)
    })
    $('#index').on('click', function() {
        app.navigation.run(false)
        setTimeout(function() {
            window.location = "../index.html"
        }, 100)
    })
    $('#close').on('click', function() {
        app.navigation.run(false)
        setTimeout(window.close, 100)
    })
    if (resume) {
        $('#network-resume').on('click', function() {
            app.navigation.run(!running)
            if (running) {
                resume()
            }
        })
    }
    $('#network-add-submit').on('click', function() {
        app.navigation.get_network_list(simulate)
    })
    $('.level').on('click', function() {
        $('.level').find('.glyphicon-ok').hide()
        config_global.set('level', parseInt($(this).attr('level')))
        for (var nid in data.nodes) {
            var node = data.nodes[nid];
            if (node.model) {
                app.slider.update_paramSlider(node)
            }
        }
        app.slider.update_dataSlider_level()
        $(this).find('.glyphicon-ok').show()
    })
    $('#autoscale').on('click', update)
}

module.exports = {
    eventHandler: eventHandler
}
