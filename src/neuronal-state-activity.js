"use strict"

// var times, values;
window.jQuery = window.$ = require('jquery');
require('bootstrap');
var d3Array = require('d3-array');
var events = require('./events');
var models = require("./models");
var nav = require('./navigation');
var req = require('./request');
var slider = require("./slider");
var lineChart = require('./line-chart');

window.level = 1;
window.data = {
    simtime: 1000.,
    kernel: {
        grng_seed: 0,
    },
    nodes: [{
        type: 'neuron',
        model: undefined,
        n: 10,
        params: {},
        record_from: 'V_m',
    }, {
        type: 'input',
        model: undefined,
        params: {},
    }, {
        type: 'output',
        model: 'multimeter',
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
            outdegree: 1,
        },
        syn_spec: {
            weight: -1.
        }
    }, {
        source: 2,
        target: 0,
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
        max: 10,
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
    data.nodes.map(function (node) {
        if ('events' in node) {
            node.events = {}
        }
    })
    var sendData = {
        kernel: data.kernel,
        simtime: data.simtime,
        nodes: data.nodes,
        links: data.links,
    }
    req.simulate('nest_simulation', sendData)
        .done(function(res) {
            data.events = res.events;
            data.curtime = res.curtime;
            data.nodes[0].ids = res.nodes[0].ids;
            data.nodes[2].events = res.nodes[2].events;
            var ids = data.nodes[0].ids;
            window.times = []
            window.values = ids.map(function() {
                return []
            });
            data.nodes[2].events.senders.map(function(d, i) {
                values[d-ids[0]].push(data.nodes[2].events[data.nodes[0].record_from][i])
                if (d == ids[0]) {
                    times.push(data.nodes[2].events.times[i])
                }
            });

            chart.data({
                    x: times,
                    y: values
                })
                .xlim(d3Array.extent(times))
                .ylim(d3Array.extent([].concat.apply([], values)))
                .ylabel(models.record_labels[data.nodes[0].record_from])
                .update();
        })
}

window.chart = lineChart('#chart')
    .xlabel('Time (ms)');

models.load_model_list(data.nodes, ['parrot_neuron'])
nav.init_button(data, 'neuronal_state_activity')
setTimeout(function() {
    events.eventHandler(data, simulate)
}, 200)
nav.network_added(data, simulate, 'neuronal_state_activity')


$('#id_record').on('change', function() {
    data.nodes[0].record_from = this.value;
    var ids = data.nodes[0].ids;
    values = ids.map(function() {
        return []
    });
    data.nodes[2].events.senders.map(function(d, i) {
        values[d-ids[0]].push(data.nodes[2].events[data.nodes[0].record_from][i])
    });

    chart.data({
            x: times,
            y: values
        })
        .ylim(d3Array.extent([].concat.apply([], values)))
        .ylabel(models.record_labels[data.nodes[0].record_from])
        .update();
})
