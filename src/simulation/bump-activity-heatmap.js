"use strict"

// var data, chart, simulate;
window.jQuery = require('jquery');
require('bootstrap');
var d3Array = require('d3-array');
var events = require('../events');
var models = require("../models");
var nav = require('../navigation');
var req = require('./request');
var slider = require("../slider");
var heatmapChart = require('../chart/heatmap-chart');

window.data = {
    network: 'gamma',
    sim_time: 100.,
    kernel: {
        grng_seed: 0,
    },
    nodes: [{
        type: 'neuron',
        model: 'iaf_cond_alpha',
        params: {
            'C_m': 200.0,
            'E_L': -80.0,
            'E_ex': 0.0,
            'E_in': -64.0,
            'V_reset': -80.0,
            'V_th': -45.0,
            'g_L': 12.5,
            't_ref': 2.0,
            'tau_minus': 20.0,
            'tau_syn_ex': 5.0,
            'tau_syn_in': 10.0,
        },
        n: 2500,
        nrow: 50,
        ncol: 50,
    }, {
        type: 'input',
        model: 'noise_generator',
        // stim_time: [0, 1000],
        params: {
            mean: 1000.
        },
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
            outdegree: 400,
        },
        syn_spec: {
            weight: -1.
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
    // stim_time: {
    //     value: data.nodes[1].stim_time,
    //     min: 0,
    //     max: data.sim_time,
    //     step: 10,
    //     tooltip: 'show',
    //     tooltip_split: true,
    // },
    grng_seed: {
        value: data.kernel.grng_seed,
        min: 0,
        max: 1000,
        step: 1
    },
    outdegree: {
        value: data.links[1].conn_spec.outdegree,
        min: 0,
        max: 400,
        step: 10,
    }
}

slider.create_dataSlider('#general', 'sim_time', 1, 'Simulation time (ms)', slider_options.sim_time)
    .on('slideStop', function(d) {
        data.sim_time = d.value;
        // if (data.nodes[1].stim_time[1] < data.sim_time) {
        //     data.nodes[1].params.stop = data.nodes[1].stim_time[1]
        // } else {
        //     delete data.nodes[1].params.stop
        // }
    })
slider.create_dataSlider('#general', 'grng_seed', 2, 'Random number generated seed', slider_options.grng_seed)
    .on('slideStop', function(d) {
        data.kernel.grng_seed = d.value;
    })
    // slider.create_dataSlider('#input', 'stim_time', 2, 'Stimulus time', slider_options.stim_time)
    //     .on('slideStop', function(d) {
    //         data.nodes[1].stim_time = d.value;
    //         data.nodes[1].params.start = d.value[0];
    //         if (data.nodes[1].stim_time[1] < data.sim_time) {
    //             data.nodes[1].params.stop = data.nodes[1].stim_time[1]
    //         } else {
    //             delete data.nodes[1].params.stop
    //         }
    //     })
slider.create_dataSlider('#neuron', 'outdegree', 3, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })

function simulate() {
    slider.update_dataSlider('sim_time', data.sim_time)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
        // slider.update_dataSlider('stim_time', data.nodes[1].stim_time)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)

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
            data.nodes[0].nrow = res.nodes[0].nrow;
            data.nodes[0].ncol = res.nodes[0].ncol;
            data.nodes[2].events = res.nodes[2].events;
            var times = data.nodes[2].events['times'];
            var senders = data.nodes[2].events['senders'].filter(function(d, i) {
                return times[i] > (data.kernel.time - data.sim_time)
            })

            var h1 = d3Array.histogram()
                .domain([1, data.nodes[0].ids.length + 1])
                .thresholds(data.nodes[0].ids)(senders);
            var h1 = h1.map(function(d) {
                return d.length * 1
            })

            chart.xScale.domain([0, data.nodes[0].nrow])
            chart.yScale.domain([0, data.nodes[0].ncol])
            chart.colorScale.domain([0, 5])
            chart.data({
                    i: d3Array.range(0, h1.length),
                    x: d3Array.range(0, data.nodes[0].ncol),
                    y: d3Array.range(0, data.nodes[0].nrow),
                    c: h1,
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
            links: data.links,
        })
        .done(function(res) {
            data.kernel.time = res.kernel.time;
            for (var key in res.nodes[2].events) {
                dataEvents[key] = dataEvents[key].concat(res.nodes[2].events[key])
                data.nodes[2].events[key] = dataEvents[key]
            }
            delete window.dataEvents
            var times = data.nodes[2].events['times'];
            var senders = data.nodes[2].events['senders'].filter(function(d, i) {
                return times[i] > (data.kernel.time - data.sim_time)
            })
            data.nodes[2].events['senders'] = senders
            data.nodes[2].events['times'] = times.filter(function(d, i) {
                return times[i] > (data.kernel.time - data.sim_time)
            })

            var h1 = d3Array.histogram()
                .domain([1, data.nodes[0].ids.length + 1])
                .thresholds(data.nodes[0].ids)(senders);
            var h1 = h1.map(function(d) {
                return d.length * 1
            })

            $('#clip').empty()
            chart.data({
                    i: d3Array.range(0, h1.length),
                    x: d3Array.range(0, data.nodes[0].ncol),
                    y: d3Array.range(0, data.nodes[0].nrow),
                    c: h1,
                })
                .update();

            resume()
        })
}

window.chart = heatmapChart('#chart')
    .xlabel('Neuron Row ID')
    .ylabel('Neuron Col ID');

models.load_model_list(data.nodes, ['parrot_neuron'])
nav.init_button(data, 'bump_activity')
setTimeout(function() {
    models.model_selected(data.nodes[0])
    models.model_selected(data.nodes[1])
    slider.update_paramSlider(data.nodes[0])
    slider.update_paramSlider(data.nodes[1])
    events.eventHandler(data, simulate, resume)
}, 1000)
nav.network_added(data, simulate, 'bump_activity')
simulate()
