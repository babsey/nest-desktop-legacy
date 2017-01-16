"use strict"

// var data, chart, simulate;
window.jQuery = require('jquery');
require('bootstrap');
var events = require('../events')
var models = require("../models");
var nav = require('../navigation');
var req = require('./request');
var slider = require("../slider");
var scatterChart = require('../chart/scatter-chart');

window.data = {
    network: 'simple',
    sim_time: 1000.,
    kernel: {
        grng_seed: 0,
    },
    nodes: [{
        type: 'neuron',
        model: undefined,
        n: 100,
        params: {},
    }, {
        type: 'input',
        model: undefined,
        stim_time: [0, 1000],
        params: {},
    }, {
        type: 'output',
        model: 'spike_detector',
        params: {},
    }],
    links: [{
        source: 1,
        target: 0,
    }, {
        source: 0,
        target: 0,
        conn_spec: {
            rule: 'fixed_outdegree',
            outdegree: 100,
        },
        syn_spec: {
            weight: -10.
        }
    }, {
        source: 0,
        target: 2,
    }]
}

var slider_options = {
    sim_time: {
        value: data.sim_time,
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
    stim_time: {
        value: data.nodes[1].stim_time,
        min: 0,
        max: data.sim_time,
        step: 10,
        tooltip: 'show',
        tooltip_split: true,
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
    },
    weight: {
        value: data.links[1].syn_spec.weight,
        min: -10,
        max: 10,
        step: .1
    }
}

slider.create_dataSlider('#general', 'sim_time', 0, 'Simulation time (ms)', slider_options.sim_time)
    .on('slideStop', function(d) {
        data.sim_time = d.value;
        if (data.nodes[1].stim_time[1] < data.sim_time) {
            data.nodes[1].params.stop = data.nodes[1].stim_time[1]
        } else {
            delete data.nodes[1].params.stop
        }
    })
slider.create_dataSlider('#general', 'grng_seed', 0, 'Random number generated seed', slider_options.grng_seed)
    .on('slideStop', function(d) {
        data.kernel.grng_seed = d.value;
    })
slider.create_dataSlider('#input', 'stim_time', 1, 'Stimulus time', slider_options.stim_time)
    .on('slideStop', function(d) {
        data.nodes[1].stim_time = d.value;
        data.nodes[1].params.start = d.value[0];
        if (data.nodes[1].stim_time[1] < data.sim_time) {
            data.nodes[1].params.stop = data.nodes[1].stim_time[1]
        } else {
            delete data.nodes[1].params.stop
        }
    })
slider.create_dataSlider('#neuron', 'n', 0, 'Population size', slider_options.n)
    .on('slideStop', function(d) {
        data.nodes[0].n = d.value;
    })
slider.create_dataSlider('#neuron', 'outdegree', 0, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })
slider.create_dataSlider('#neuron', 'weight', 4, 'Weight', slider_options.weight)
    .on('slideStop', function(d) {
        data.links[1].syn_spec.weight = d.value;
    })

function simulate() {
    slider.update_dataSlider('sim_time', data.sim_time)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
    slider.update_dataSlider('stim_time', data.nodes[1].stim_time)
    slider.update_dataSlider('n', data.nodes[0].n)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)
    slider.update_dataSlider('weight', data.links[1].syn_spec.weight)

    if (running) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    data.nodes[2].events = {};
    req.simulate({
            network: data.network,
            kernel: data.kernel,
            sim_time: data.sim_time,
            nodes: data.nodes,
            links: data.links,
        })
        .done(function(res) {
            data.kernel.time = res.kernel.time;
            for (var idx in res.nodes) {
                data.nodes[idx].ids = res.nodes[idx].ids;
            }
            data.nodes[2].events = res.nodes[2].events;

            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
                chart.yScale.domain([0, data.nodes[0].n])
            }
            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders']
                })
                .update();
        })
}

function resume() {
    if (!(running)) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    window.dataEvents = data.nodes[2].events;
    data.nodes[2].events = {};
    req.resume({
            network: data.network,
            kernel: data.kernel,
            sim_time: 10.,
            nodes: data.nodes,
            // links: data.links,
        })
        .done(function(res) {
            data.kernel.time = res.kernel.time;
            for (var key in res.nodes[2].events) {
                dataEvents[key] = dataEvents[key].concat(res.nodes[2].events[key])
                data.nodes[2].events[key] = dataEvents[key]
            }


            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
                chart.yScale.domain([0, data.nodes[0].n])
            }
            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders']
                })
                .update();
            resume()
        })
}

window.chart = scatterChart('#chart')
    .xlabel('Time (ms)')
    .ylabel('Neuron ID')
    .drag();


models.load_model_list(data.nodes)
nav.init_button(data, 'spike_activity')
setTimeout(function() {
    events.eventHandler(data, simulate, resume)
}, 1000)
nav.network_added(data, simulate, 'spike_activity')

$('#autoscale').on('click', function() {
    if (document.getElementById('autoscale').checked) {
        chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
        chart.yScale.domain([0, data.nodes[0].n])
        chart.update();
    }
})
