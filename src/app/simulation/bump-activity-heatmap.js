"use strict"

window.jQuery = require('jquery');
require('bootstrap');
const d3 = require('d3');
const app = require('../app');
const heatmapChart = require('../chart/heatmap-chart');

var simulation = 'bump-activity-heatmap';
var config = require('../config').simulation(simulation);
window.data = config.data;
app.navigation.init_controller(data.nodes)
app.navigation.init_button(data, simulation)

// Update data from slider values
var slider_options = config.slider_options;
app.slider.create_dataSlider('#global', 'sim_time', data.sim_time, slider_options.sim_time)
    .on('slideStop', function(d) {
        data.sim_time = d.value;
    })

app.slider.update_dataSlider_level()
data.nodes.map(function(node) {
    if (node.model) {
        app.models.model_selected(node)
        app.slider.update_paramSlider(node)
    }
})

function update_slider() {
    app.slider.update_dataSlider('sim_time', data.sim_time)
}

function update() {
    var times = data.nodes[2].events['times'];
    var senders = data.nodes[2].events['senders'].filter(function(d, i) {
        return times[i] > (data.kernel.time - 100)
    })
    data.nodes[2].events['senders'] = senders
    data.nodes[2].events['times'] = times.filter(function(d, i) {
        return times[i] > (data.kernel.time - 100)
    })

    var h1 = d3.histogram()
        .domain([1, data.nodes[1].ids.length + 1])
        .thresholds(data.nodes[1].ids)(senders);
    var h1 = h1.map(function(d) {
        return d.length * 1
    })

    $('#clip').empty()
    chart.xScale.domain([0, data.nodes[1].nrow])
    chart.yScale.domain([0, data.nodes[1].ncol])
    chart.colorScale.domain([0, 5])
    chart.data({
            i: d3.range(0, h1.length),
            x: d3.range(0, data.nodes[1].ncol),
            y: d3.range(0, data.nodes[1].nrow),
            c: h1,
        })
        .update();
}

function simulate() {
    update_slider()

    if (running) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    data.nodes[2].events = {};
    app.request.simulate({
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

            if (chart.xAxis() == null) {
                chart.xAxis(chart.xScale)
                    .yAxis(chart.yScale)
                    .xLabel('Neuron Row ID')
                    .yLabel('Neuron Col ID');
            }

            update()
        })
}

function resume() {
    app.navigation.running_update(running)
    if (!(running)) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return

    window.dataEvents = data.nodes[2].events;
    data.nodes[2].events = {};
    app.request.resume({
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
            window.dataEvents = null;

            update()
            resume()
        })
}

app.navigation.network_added(data, simulate, simulation)
setTimeout(function() {
    app.events.eventHandler(data, simulate, resume)
    simulate()
}, 1000)

window.chart = heatmapChart('#chart');
