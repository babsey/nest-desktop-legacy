"use strict"

require('bootstrap');
const scatterChart = require('../chart/scatter-chart');
const barChart = require('../chart/bar-chart');
const networkLayout = require('../network-layout');

function update() {
    // layout.restart()
    if (document.getElementById('autoscale').checked) {
        chart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
        barchart.xScale.domain([data.kernel.time - data.sim_time, data.kernel.time])
        chart.yScale.domain([data.nodes[1].ids[0], data.nodes[1].ids[data.nodes[1].ids.length - 1]])
    }
    var times = data.nodes[2].events['times']
    var senders = data.nodes[2].events['senders'].filter(function(d, i) {
        return times[i] > chart.xScale.domain()[0] && times[i] < chart.xScale.domain()[1]
    })
    var times = times.filter(function(d) {
        return d > chart.xScale.domain()[0] && d < chart.xScale.domain()[1]
    })
    chart.data({
            x: times,
            y: senders
        })
        .update();
    var binwidth = data.nodes[2].binwidth / 1000.
    barchart.binwidth(binwidth).popsize(data.nodes[1].nrow * data.nodes[1].ncol)
    var histogram = d3.histogram()
        .domain(chart.xScale.domain())
        .thresholds(barchart.xScale.ticks(1. / binwidth));
    var psth = histogram(data.nodes[2].events['times']);
    data.nodes[2].events.psth = psth;

    barchart.yScale.domain([0, d3.max(psth, function(d) {
        return d.length / barchart.binwidth() / barchart.popsize()
    })])
    barchart.data(psth).update()
}

function drag() {
    $('#autoscale').prop('checked', false)
    var xlim0 = chart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = chart.xScale.range();
    var dx = d3.event.dx * xx / (xs[1] - xs[0]);

    chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    barchart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    update()
}

function zoom() {
    $('#autoscale').prop('checked', false)
    var xlim0 = chart.xScale.domain();
    // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
    var xx = (xlim0[0] + xlim0[1]) / 2;
    var k = d3.event.transform.k;

    chart.xScale.domain([xx - xx / k, xx + xx / k])
    barchart.xScale.domain([xx - xx / k, xx + xx / k])
    update()
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
            data.nodes[2].events = res.nodes[2].events;

            if (chart.xAxis() == null) {
                barchart.xAxis(barchart.xScale)
                    .yAxis(barchart.yScale)
                    .xLabel('Time [ms]');
                chart.xAxis(chart.xScale)
                    .yAxis(chart.yScale)
                    .yLabel('Neuron ID');

                barchart.onDrag(drag);
                chart.onDrag(drag);
                barchart.onZoom(zoom);
                chart.onZoom(zoom);
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
            window.dataEvents = null;
            update()
            resume()
        })
}

window.barchart = barChart('#chart', (window.innerHeight * 2. / 10.) - 10);
barchart.g
    .attr('height', window.innerHeight * 2. / 10. - 10)
    .attr('transform', 'translate(' + barchart.margin.left + ',' + (window.innerHeight * 8. / 10. - barchart.margin.bottom + 10) + ')');

window.chart = scatterChart('#chart');
chart.y = chart.height
chart.g.attr('height', window.innerHeight * 7. / 10.);
chart.g.select('#clip').attr('transform', 'translate(0,' + (+chart.g.attr('height') - chart.height) + ')');
//
// window.layout = networkLayout('#chart')
//     .nodes(data.nodes)
//     .links(data.links)
//     .restart()

app.navigation.init_button(simulate)
app.events.eventHandler(simulate, resume, update)
setTimeout(simulate, 100)
