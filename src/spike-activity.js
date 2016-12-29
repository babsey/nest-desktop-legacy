"use strict"

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var d3Request = require('d3-request');

// var data, chart, simulate;
var models = require("./models");
var slider = require("./slider");
var req = require('./request');
var nav = require('./navigation');
var scatterChart = require('./scatter-chart');

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
                chart.data({
                        x: data.events['times'],
                        y: data.events['senders']
                    })
                    .xlim([0,data.simtime])
                    .ylim([0, data.nodes.neuron.pop.length])
                    .update();
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
