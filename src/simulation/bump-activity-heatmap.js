"use strict"

window.jQuery = require('jquery');
require('bootstrap');
const d3Array = require('d3-array');
const events = require('../events');
const models = require("../models");
const nav = require('../navigation');
const req = require('./request');
const slider = require("../slider");
const heatmapChart = require('../chart/heatmap-chart');
var config = require('../config').simulation('bump-activity-heatmap');

window.data = config.data;
const slider_options = config.slider_options;

// Update data from slider values
data.sim_time = slider_options.sim_time.value

slider.create_dataSlider('#general', 'sim_time', 1, 'Simulation time (ms)', slider_options.sim_time)
    .on('slideStop', function(d) {
        data.sim_time = d.value;
    })

function update_slider() {
    slider.update_dataSlider('sim_time', data.sim_time)
}

function simulate() {
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
            data.nodes[1].nrow = res.nodes[1].nrow;
            data.nodes[1].ncol = res.nodes[1].ncol;
            data.nodes[2].events = res.nodes[2].events;
            var times = data.nodes[2].events['times'];
            var senders = data.nodes[2].events['senders'];

            var h1 = d3Array.histogram()
                .domain([1, data.nodes[1].ids.length + 1])
                .thresholds(data.nodes[1].ids)(senders);
            var h1 = h1.map(function(d) {
                return d.length * 1
            })

            chart.xScale.domain([0, data.nodes[1].nrow])
            chart.yScale.domain([0, data.nodes[1].ncol])
            chart.colorScale.domain([0, 5])
            chart.data({
                    i: d3Array.range(0, h1.length),
                    x: d3Array.range(0, data.nodes[1].ncol),
                    y: d3Array.range(0, data.nodes[1].nrow),
                    c: h1,
                })
                .update();
            running = true
            resume()
        })
}

function resume() {
    nav.running_update(running)
    $('.sliderInput').slider('enable')
    if (!(running)) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    window.dataEvents = data.nodes[2].events;
    data.nodes[2].events = {};
    req.resume({
            network: data.network,
            kernel: data.kernel,
            sim_time: data.sim_time,
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
                // return times[i] > (data.kernel.time - data.sim_time)
                return times[i] > (data.kernel.time - 100)
            })
            data.nodes[2].events['senders'] = senders
            data.nodes[2].events['times'] = times.filter(function(d, i) {
                // return times[i] > (data.kernel.time - data.sim_time)
                return times[i] > (data.kernel.time - 100)
            })

            var h1 = d3Array.histogram()
                .domain([1, data.nodes[1].ids.length + 1])
                .thresholds(data.nodes[1].ids)(senders);
            var h1 = h1.map(function(d) {
                return d.length * 1
            })

            $('#clip').empty()
            chart.data({
                    i: d3Array.range(0, h1.length),
                    x: d3Array.range(0, data.nodes[1].ncol),
                    y: d3Array.range(0, data.nodes[1].nrow),
                    c: h1,
                })
                .update();

            resume()
        })
}

models.load_model_list(data.nodes)
nav.init_button(data, 'bump_activity_heatmap')
nav.network_added(data, simulate, 'bump_activity_heatmap')
slider.update_dataSlider_level()
setTimeout(function() {
    models.model_selected(data.nodes[0])
    slider.update_paramSlider(data.nodes[0])
    models.model_selected(data.nodes[1])
    slider.update_paramSlider(data.nodes[1])
    events.eventHandler(data, simulate, resume)
    simulate()
}, 1000)

window.chart = heatmapChart('#chart')
    .xlabel('Neuron Row ID')
    .ylabel('Neuron Col ID');
