"use strict"

window.jQuery = window.$ = require('jquery');
require('bootstrap');
const d3Array = require('d3-array');
const d3Selection = require('d3-selection');
const d3Zoom = require('d3-zoom');
const events = require('../events');
const models = require("../models");
const nav = require('../navigation');
const req = require('./request');
const slider = require("../slider");
const lineChart = require('../chart/line-chart');
const networkLayout = require('../network-layout');
var config = require('../config').simulation('neuronal-state-activity');

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
    .on('slideStart', function(d) {
        if (data.nodes[0].stim_time[1] == data.sim_time) {
            delete data.nodes[0].params.stop
        }
    })
    .on('slideStop', function(d) {
        data.sim_time = d.value;
        if (data.nodes[0].params.stop && (data.nodes[0].stim_time[1] < data.sim_time)) {
            data.nodes[0].params.stop = data.nodes[0].stim_time[1]
        } else {
            data.nodes[0].stim_time[1] = data.sim_time
        }
    })
slider.create_dataSlider('#general', 'grng_seed', 2, 'Random number generated seed', slider_options.grng_seed)
    .on('slideStop', function(d) {
        data.kernel.grng_seed = d.value;
    })
slider.create_dataSlider('#input', 'stim_time', 2, 'Stimulus time', slider_options.stim_time)
    .on('slideStop', function(d) {
        delete data.nodes[0].params.stop
        data.nodes[0].stim_time = d.value;
        data.nodes[0].params.start = d.value[0];
        if (data.nodes[0].stim_time[1] < data.sim_time) {
            data.nodes[0].params.stop = data.nodes[0].stim_time[1]
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
slider.create_dataSlider('#neuron', 'outdegree', 4, 'Outdegree', slider_options.outdegree)
    .on('slideStop', function(d) {
        data.links[1].conn_spec.outdegree = d.value;
    })
slider.create_dataSlider('#neuron', 'recurrent_weight', 4, 'Recurrent synaptic weight', slider_options.recurrent_weight)
    .on('slideStop', function(d) {
        data.links[1].syn_spec.weight = d.value;
    })

function update_slider() {
    slider.update_dataSlider('sim_time', data.sim_time)
    slider.update_dataSlider('grng_seed', data.kernel.grng_seed)
    slider.update_dataSlider('stim_time', data.nodes[0].stim_time)
    slider.update_dataSlider('input_weight', data.links[0].syn_spec.weight)
    slider.update_dataSlider('n', data.nodes[1].n)
    slider.update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)
    slider.update_dataSlider('recurrent_weight', data.links[1].syn_spec.weight)
}

function update() {

    var ids = data.nodes[1].ids;
    window.times = []
    var ids = data.nodes[1].ids;
    window.values = ids.map(function() {
        return []
    });

    if (document.getElementById('autoscale').checked) {
        d3Zoom.zoomIdentity.scale(1)
        chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
    }

    data.nodes[2].events.senders.map(function(d, i) {
        if ((data.nodes[2].events.times[i] >= chart.xScale.domain()[0]) && (data.nodes[2].events.times[i] < chart.xScale.domain()[1])) {
            values[d - ids[0]].push(data.nodes[2].events[data.nodes[2].record_from][i])
            if (d == ids[0]) {
                times.push(data.nodes[2].events.times[i])
            }
        }
    });
    chart.yScale.domain(d3Array.extent([].concat.apply([], values)))

    chart.data({
            x: times,
            y: values
        })
        .yLabel(models.record_labels[data.nodes[2].record_from])
        .update();
}

function drag() {
    $('#autoscale').prop('checked', false)
    var xlim0 = chart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = chart.xScale.range();
    var dx = d3Selection.event.dx * xx / (xs[1] - xs[0]);
    chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    update()
}

function zoom() {
    $('#autoscale').prop('checked', false)
    var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
    var xx = (xlim0[0] + xlim0[1]) / 2;
    var k = d3Selection.event.transform.k;
    chart.xScale.domain([xx - xx / k, xx + xx / k])
    update()
}

function simulate() {
    layout.restart()
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
            data.nodes[2].params = res.nodes[2].params
            if (!(data.nodes[2].record_from in data.nodes[2].events)) {
                data.nodes[2].record_from = 'V_m'
            }
            models.get_recordables_list(data.nodes[2])
            data.kernel.time = res.kernel.time;
            for (var idx in res.nodes) {
                data.nodes[idx].ids = res.nodes[idx].ids;
            }
            data.nodes[2].events = res.nodes[2].events;

            if (chart.xAxis() == null) {
                chart.xAxis(chart.xScale)
                    .yAxis(chart.yScale)
                    .xLabel('Time (ms)');
                chart
                    .onDrag(drag)
                    .onZoom(zoom);
            }
            update()
        })
}

function resume() {
    nav.running_update(running)
    if (!(running)) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    window.dataEvents = data.nodes[2].events
    data.nodes[2].events = {};
    req.resume({
            network: data.network,
            kernel: data.kernel,
            sim_time: 1.,
            nodes: data.nodes,
            // links: data.links,
        })
        .done(function(res) {
            data.kernel.time = res.kernel.time;
            for (var key in res.nodes[2].events) {
                dataEvents[key] = dataEvents[key].concat(res.nodes[2].events[key])
                data.nodes[2].events[key] = dataEvents[key]
            }

            update()
            resume()
        })
}

models.load_model_list(data.nodes)
nav.init_button(data, 'neuronal_state_activity')
slider.update_dataSlider_level()
setTimeout(function() {
    events.eventHandler(data, simulate, resume)
    nav.network_added(data, simulate, 'neuronal_state_activity')
}, 1000)

window.chart = lineChart('#chart');
window.layout = networkLayout('#chart')
    .nodes(data.nodes)
    .links(data.links)
    .restart()

$('#id_record').on('change', function() {
    selected_node.record_from = this.value;
    var ids = data.nodes[1].ids;
    values = ids.map(function() {
        return []
    });
    selected_node.events.senders.map(function(d, i) {
        values[d - ids[0]].push(selected_node.events[selected_node.record_from][i])
    });

    if (document.getElementById('autoscale').checked) {
        chart.yScale.domain(d3Array.extent([].concat.apply([], values)))
    }
    chart.data({
            x: times,
            y: values
        })
        .yLabel(models.record_labels[selected_node.record_from] || 'a.u.')
        .update();
})

$('#autoscale').on('click', update)
