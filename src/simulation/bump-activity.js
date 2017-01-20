"use strict"

window.jQuery = require('jquery');
require('bootstrap');
const events = require('../events');
const models = require("../models");
const nav = require('../navigation');
const req = require('./request');
const slider = require("../slider");
const scatterChart = require('../chart/scatter-chart');
var config = require('../config').simulation('bump-activity');

window.data = config.data;
var slider_options = config.slider_options;

// Update data from slider values
data.sim_time = slider_options.sim_time.value
data.kernel.grng_seed = slider_options.grng_seed.value
data.nodes[0].stim_time = slider_options.stim_time.value
data.nodes[0].params.start = slider_options.stim_time.value[0]
if (data.nodes[0].stim_time[1] < data.sim_time) {
    data.nodes[0].params.stop = data.nodes[0].stim_time[1]
}
data.links[0].syn_spec.weight = slider_options.input_weight.value
data.links[1].conn_spec.outdegree = slider_options.outdegree.value
data.links[1].syn_spec.weight = slider_options.recurrent_weight.value

slider.create_dataSlider('#general', 'sim_time', 1, 'Simulation time (ms)', slider_options.sim_time)
    .on('slideStop', function(d) {
        data.sim_time = d.value;
        if (data.nodes[0].stim_time[1] < data.sim_time) {
            data.nodes[0].params.stop = data.nodes[0].stim_time[1]
        } else {
            delete data.nodes[0].params.stop
        }
    })
slider.create_dataSlider('#general', 'grng_seed', 2, 'Random number generated seed', slider_options.grng_seed)
    .on('slideStop', function(d) {
        data.kernel.grng_seed = d.value;
    })
slider.create_dataSlider('#input', 'stim_time', 2, 'Stimulus time', slider_options.stim_time)
    .on('slideStop', function(d) {
        data.nodes[0].stim_time = d.value;
        data.nodes[0].params.start = d.value[0];
        if (data.nodes[0].stim_time[1] < data.sim_time) {
            data.nodes[0].params.stop = data.nodes[0].stim_time[1]
        } else {
            delete data.nodes[0].params.stop
        }
    })
slider.create_dataSlider('#input', 'input_weight', 4, 'Input synaptic weight', slider_options.input_weight)
    .on('slideStop', function(d) {
        data.links[0].syn_spec.weight = d.value;
    })
slider.create_dataSlider('#neuron', 'outdegree', 2, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })
slider.create_dataSlider('#neuron', 'recurrent_weight', 4, 'Recurrent weight', slider_options.recurrent_weight)
    .on('slideStop', function(d) {
        data.links[1].syn_spec.weight = d.value;
    })

function update_slider(){
    slider.update_dataSlider('sim_time', data.sim_time)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
    slider.update_dataSlider('stim_time', data.nodes[0].stim_time)
    slider.update_dataSlider('input_weight', data.links[0].syn_spec.weight)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)
    slider.update_dataSlider('recurrent_weight', data.links[1].syn_spec.weight)
}

function simulate() {
    update_slider()

    if (running) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    if (data.nodes[0].params.stop == data.sim_time) {
        delete data.nodes[0].params.stop
    }
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

            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
                chart.yScale.domain([0, (data.nodes[1].nrow*data.nodes[1].ncol)])
            }
            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders'],
                })
                .update();
        })
}

function resume() {
    nav.running_update(running)
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

            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
                chart.yScale.domain([0, (data.nodes[1].nrow*data.nodes[1].ncol)])
            }
            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders'],
                })
                .update();

            resume()
        })
}

window.chart = scatterChart('#chart')
    .xlabel('Time [ms]')
    .ylabel('Neuron ID')
    .drag();

models.load_model_list(data.nodes)
nav.init_button(data, 'bump_activity')
slider.update_dataSlider_level()
setTimeout(function() {
    models.model_selected(data.nodes[1])
    slider.update_paramSlider(data.nodes[1])
    events.eventHandler(data, simulate, resume)
    nav.network_added(data, simulate, 'bump_activity')
}, 1000)

$('#autoscale').on('click', function () {
    if (document.getElementById('autoscale').checked) {
        chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
        chart.yScale.domain([0, (data.nodes[1].nrow*data.nodes[1].ncol)])
        chart.update();
    }
})
