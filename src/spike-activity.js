"use strict"

require('bootstrap');
var d3Request = require('d3-request');

var models = require("../dist/js/models");
var slider = require("../dist/js/slider");
var req = require('../dist/js/request');
var nav = require('../dist/js/navigation');
var scatterChart = require('../dist/js/scatter-chart');

data = {
    simtime: 1000.,
    level: 1,
    nodes: {
        neuron: {
            npop: 10,
            outdegree: 10,
            model: undefined,
            params: {},
        },
        input: {
            model: undefined,
            params: {},
        }
    }
}

function simulate() {
    setTimeout(function() {
        if ((data.nodes.neuron.model == undefined) || (data.nodes.input.model == undefined)) return
        var sendData = {
            simtime: data.simtime,
            nodes: data.nodes,
        }
        req.simulate('spike_activity', sendData)
            .done(function(res) {
                data.events = res.events;
                data.curtime = res.curtime;
                data.nodes.neuron.pop = res.nodes.neuron.pop;
                chart.update(data.events['times'], data.events['senders'])
                    // .xlim([data.time - 1000, data.time])
                    .ylim([0, data.nodes.neuron.pop.length]);
            })
    }, 100)
}

slider.create_paramslider(data)
models.load_model_list(data.nodes)
models.model_select_onChange(data.nodes, data.level)
nav.init_button(data, 'spike_activity')

setTimeout(function() {
    $('.sliderInput').on('slideStop', simulate)
    $('.model_select').on('change', function() {
        var node = $(this).parents('.model').attr('id');
        var model = this.value;
        slider.update_modelslider(data.nodes, node, model, data.level)
        simulate()
    })
    $('.network').on('click', simulate)
}, 100)

$('#network-add-submit').on('click', function() {
    setTimeout(function() {
        nav.get_network_list(data, 'spike_activity')
        setTimeout(function() {
            $('.network').on('click', simulate)
        }, 100)
    }, 100)
})

chart = scatterChart('#chart')
    .xlabel('Time (ms)')
    .ylabel('Neuron ID');
