"use strict"

// var data, chart, simulate;
window.jQuery = require('jquery');
require('bootstrap');
var d3Array = require('d3-array');
var events = require('./events');
var models = require("./models");
var nav = require('./navigation');
var req = require('./request');
var slider = require("./slider");
var heatmapChart = require('./heatmap-chart');

data = {
    kernel: {
        grng_seed: 0,
    },
    simtime: 1000.,
    level: 1,
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
        n: 400,
        nrow: 20,
        ncol: 20,
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
        weight: -1.
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
    outdegree: {
        value: data.links[1].conn_spec.outdegree,
        min: 0,
        max: 400,
        step: 10,
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
slider.create_dataSlider('#outdegree', 'outdegree', 0, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })

function simulate() {
    slider.update_dataSlider('simtime', data.simtime)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)

    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return
    var sendData = {
        kernel: data.kernel,
        simtime: data.simtime,
        nodes: data.nodes,
        links: data.links,
    }
    req.simulate('bump_activity', sendData)
        .done(function(res) {
            data.events = res.events;
            data.curtime = res.curtime;
            data.nodes[0].ids = res.nodes[0].ids;
            data.nodes[0].nrow = res.nodes[0].nrow;
            data.nodes[0].ncol = res.nodes[0].ncol;

            var h1 = d3Array.histogram()
                .domain([1, data.nodes[0].ids.length + 1])
                .thresholds(data.nodes[0].ids)(data.events['senders']);
            var h1 = h1.map(function(d) {
                return d.length * 1
            })

            chart.data({
                    y: d3Array.range(0, data.nodes[0].nrow),
                    x: d3Array.range(0, data.nodes[0].ncol),
                    c: h1,
                })
                .xlim([0, data.nodes[0].nrow])
                .ylim([0, data.nodes[0].ncol])
                .clim([0, 50])
                .update();
        })
}

selected_node = data.nodes[0]

chart = heatmapChart('#chart')
    .xlabel('Neuron Row ID')
    .ylabel('Neuron Col ID');

models.load_model_list(data.nodes)
nav.init_button(data, 'bump_activity')
setTimeout(function() {
    models.model_selected(selected_node)
    slider.update_paramSlider(selected_node, data.level)
    events.eventHandler(data, simulate)
}, 200)
nav.network_added(data, simulate, 'bump_activity')
