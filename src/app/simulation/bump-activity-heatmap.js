"use strict"

require('bootstrap');
const heatmapChart = require('../chart/heatmap-chart');

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

var chart = heatmapChart('#chart');
app.navigation.init_button(simulate)
app.events.eventHandler(simulate, resume, update)
setTimeout(simulate, 100)
