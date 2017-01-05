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

window.level = 1;
window.data = {
    simtime: 1000.,
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

    data.nodes[2].events = {};
    var sendData = {
        kernel: data.kernel,
        simtime: data.simtime,
        nodes: data.nodes,
        links: data.links,
    }
    req.simulate('network/', sendData)
        .done(function(res) {
            data.kernel.time = res.kernel.time;
            for (var idx in res.nodes) {
                data.nodes[idx].ids = res.nodes[idx].ids;
            }
            data.nodes[2].events = res.nodes[2].events;

            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - 1000, data.kernel.time])
                chart.yScale.domain([0, data.nodes[0].n])
            }
            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders']
                })
                .update();
        })
}

var running = false;

function resume() {
    if (!(running)) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    window.dataEvents = data.nodes[2].events;
    data.nodes[2].events = {};
    var sendData = {
        kernel: data.kernel,
        simtime: 1.,
        nodes: data.nodes,
        // links: data.links,
    }
    req.simulate('network/resume/', sendData)
        .done(function(res) {
            data.kernel.time = res.kernel.time;
            for (var key in res.nodes[2].events) {
                dataEvents[key] = dataEvents[key].concat(res.nodes[2].events[key])
                data.nodes[2].events[key] = dataEvents[key]
            }


            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - 1000, data.kernel.time])
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
    events.eventHandler(data, simulate)
}, 200)
nav.network_added(data, simulate, 'spike_activity')

$('#network-resume').on('click', function() {
    if (running) {
        running = false
        $('#network-resume').find('.glyphicon').hide()
        $('#network-resume').find('.glyphicon-play').show()
    } else {
        $('#network-resume').find('.glyphicon').hide()
        $('#network-resume').find('.glyphicon-pause').show()
        running = true
        resume()
    }
})
