"use strict"

// var data, chart, simulate;
window.jQuery = require('jquery');
require('bootstrap');
var events = require('./events')
var models = require("./models");
var nav = require('./navigation');
var req = require('./request');
var slider = require("./slider");
var scatterChart = require('./scatter-chart');

data = {
    kernel: {
        grng_seed: 0,
    },
    simtime: 1000.,
    level: 1,
    nodes: [{
        type: 'neuron',
        model: undefined,
        n: 100,
        params: {},
    }, {
        type: 'input',
        model: undefined,
        params: {},
    }],
    links: []
}

data.links.push({
    source: 1,
    target: 0,
    conn_spec: 'all_to_all',
    syn_spec: {
        weight: 1.
    }
})
data.links.push({
    source: 0,
    target: 0,
    conn_spec: {
        rule: 'fixed_outdegree',
        outdegree: 100,
    },
    syn_spec: {
        weight: -10.
    }
})

var slider_options = {
    simtime: {
        value: data.simtime,
        min: 100,
        max: 2000,
        step: 100,
    },
    grng_seed: {
        value: data.kernel.grng_seed,
        min: 0,
        max: 1000,
        step: 1
    },
    n: {
        value: data.nodes[0].n,
        min: 1,
        max: 500,
        step: 1,
    },
    outdegree: {
        value: data.links[1].conn_spec.outdegree,
        min: 0,
        max: data.nodes[0].n,
        step: 1
    }
}

slider.create_dataSlider('#simtime', 'simtime', 0, 'Simulation time (ms)', slider_options.simtime)
    .on('slideStop', function(d) {
        data.simtime = d.value;
    })
slider.create_dataSlider('#grng_seed', 'grng_seed', 0, 'Random number generated seed', slider_options.grng_seed)
    .on('slideStop', function(d) {
        data.kernel.grng_seed = d.value;
    })
slider.create_dataSlider('#n', 'n', 0, 'Population size', slider_options.n)
    .on('slideStop', function(d) {
        data.nodes[0].n = d.value;
    })
slider.create_dataSlider('#outdegree', 'outdegree', 0, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })

function simulate() {
    slider.update_dataSlider('simtime', data.simtime)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
    slider.update_dataSlider('n', data.nodes[0].n)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)

    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return
    var sendData = {
        kernel: data.kernel,
        simtime: data.simtime,
        nodes: data.nodes,
        links: data.links,
    }
    req.simulate('spike_activity', sendData)
        .done(function(res) {
            data.events = res.events;
            data.curtime = res.curtime;
            data.nodes[0].ids = res.nodes[0].ids;
            chart.data({
                    x: data.events['times'],
                    y: data.events['senders']
                })
                .xlim([0, data.simtime])
                .ylim([0, data.nodes[0].n])
                .update();
        })
}

chart = scatterChart('#chart')
    .xlabel('Time (ms)')
    .ylabel('Neuron ID');


models.load_model_list(data.nodes)
nav.init_button(data, 'spike_activity')
setTimeout(function() {
    events.eventHandler(data, simulate)
}, 200)
nav.network_added(data, simulate, 'spike_activity')
