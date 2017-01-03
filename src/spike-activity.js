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

selected_node = null;
selected_link = null;

data = {
    kernel: {
        grng_seed: 0,
    },
    simtime: 1000.,
    level: 1,
    nodes: [{
        type: 'neuron',
        model: undefined,
        params: {},
        npop: 10,
        outdegree: 10,
    }, {
        type: 'input',
        model: undefined,
        params: {},
    }]
}

function simulate() {
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return
    var sendData = {
        kernel: data.kernel,
        simtime: data.simtime,
        nodes: data.nodes,
    }
    req.simulate('spike_activity', sendData)
        .done(function(res) {
            data.events = res.events;
            data.curtime = res.curtime;
            data.nodes[0].pop = res.nodes[0].pop;
            chart.data({
                    x: data.events['times'],
                    y: data.events['senders']
                })
                .xlim([0, data.simtime])
                .ylim([0, data.nodes[0].pop.length])
                .update();
        })
}

slider.create_paramslider(data)
models.load_model_list(data.nodes)
nav.init_button(data, 'spike_activity')

setTimeout(function() {
    $('.modelSlider .sliderInput').on('slideStop', function() {
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        var model = this.value;
        selected_node.model = model;
        models.selected_model(selected_node)
        slider.update_modelslider(selected_node, data.level)
        setTimeout(simulate, 100)
    })
    $('.network').on('click', function() {
        setTimeout(simulate, 100)
    })
}, 200)

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
