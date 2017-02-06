"use strict"

window.jQuery = require('jquery');
require('bootstrap');
var d3Array = require('d3-array');
var d3Scale = require('d3-scale');

const events = require('../events')
const models = require("../models");
const nav = require('../navigation');
const req = require('./request');
const slider = require("../slider");
const scatterChart = require('../chart/scatter-chart');
const barChart = require('../chart/bar-chart');
const networkLayout = require('../network-layout');
var config = require('../config').simulation('spike-activity');

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
data.nodes[1].n = slider_options.n.value
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
slider.create_dataSlider('#neuron', 'n', 1, 'Population size', slider_options.n)
    .on('slideStop', function(d) {
        data.nodes[1].n = d.value;
    })
slider.create_dataSlider('#neuron', 'outdegree', 3, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })
slider.create_dataSlider('#neuron', 'recurrent_weight', 4, 'Recurrent weight', slider_options.recurrent_weight)
    .on('slideStop', function(d) {
        data.links[1].syn_spec.weight = d.value;
    })

function update_slider() {
    slider.update_dataSlider('sim_time', data.sim_time)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
    slider.update_dataSlider('stim_time', data.nodes[0].stim_time)
    slider.update_dataSlider('n', data.nodes[1].n)
    slider.update_dataSlider('input_weight', data.links[0].syn_spec.weight)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)
    slider.update_dataSlider('recurrent_weight', data.links[1].syn_spec.weight)
}

function simulate() {
    layout.restart()
    update_slider()

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

            barchart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
            var histogram = d3Array.histogram()
                .domain([data.kernel.time - data.sim_time, data.kernel.time])
                .thresholds(barchart.xScale.ticks(100));
            var psth = histogram(data.nodes[2].events['times']);
            data.nodes[2].events.psth = psth;

            if (document.getElementById('autoscale').checked) {
                chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
                chart.yScale.domain([data.nodes[1].ids[0], data.nodes[1].ids[data.nodes[1].ids.length - 1]])
                barchart.yScale.domain([0, d3Array.max(psth, function(d) {
                    return d.length
                })])
            }

            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders']
                })
                .update();
            barchart.data(psth).update()
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
                chart.yScale.domain([data.nodes[1].ids[0], data.nodes[1].ids[data.nodes[1].ids.length - 1]])
            }
            chart.data({
                    x: data.nodes[2].events['times'],
                    y: data.nodes[2].events['senders']
                })
                .update();

            var histogram = d3Array.histogram()
                .domain([data.kernel.time - data.sim_time, data.kernel.time])
                .thresholds(d3Scale.scaleLinear().domain([data.kernel.time - data.sim_time, data.kernel.time]).ticks(100));
            var psth = histogram(data.nodes[2].events['times']);
            data.nodes[2].events.psth = psth;

            if (document.getElementById('autoscale').checked) {
                barchart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
                barchart.yScale.domain([0, d3Array.max(psth, function(d) {
                    return d.length
                })])
            }
            barchart.data(psth).update()

            resume()
        })
}

models.load_model_list(data.nodes)
nav.init_button(data, 'spike_activity')
slider.update_dataSlider_level()
setTimeout(function() {
    events.eventHandler(data, simulate, resume)
    nav.network_added(data, simulate, 'spike_activity')
}, 1000)

window.barchart = barChart('#chart', (window.innerHeight * 2. / 10.) - 10);
barchart.g
    .attr('height', window.innerHeight * 2. / 10. - 10)
    .attr('transform', 'translate(' + barchart.margin.left + ',' + (window.innerHeight * 8. / 10. - barchart.margin.bottom + 10) + ')');
barchart.xAxis(barchart.xScale)
    .yAxis(barchart.yScale)
    .xLabel('Time [ms]')
    .yLabel('Spike count')
    .update();
barchart.drag();

window.chart = scatterChart('#chart');
chart.y = chart.height
chart.g.attr('height', window.innerHeight * 7. / 10.);
chart.g.select('#clip').attr('transform', 'translate(0,' + (+chart.g.attr('height') - chart.height) + ')');
chart.xAxis(chart.xScale)
    .yAxis(chart.yScale)
    .yLabel('Neuron ID')
    .update();
chart.drag();

window.layout = networkLayout('#chart')
    .nodes(data.nodes)
    .links(data.links)
    .restart()

$('#autoscale').on('click', function() {
    if (document.getElementById('autoscale').checked) {
        chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
        chart.yScale.domain([0, data.nodes[1].n])
        chart.update();

        barchart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
        barchart.yScale.domain([0, d3Array.max(data.nodes[2].events.psth, function(d) {
            return d.length
        })])
        barchart.update();
    }
})
