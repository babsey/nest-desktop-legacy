"use strict"

require('bootstrap');
const lineChart = require('../chart/line-chart');
const networkLayout = require('../network-layout');

function update() {
    var ids = data.nodes[1].ids;
    window.times = []
    var ids = data.nodes[1].ids;
    window.values = ids.map(function() {
        return []
    });
    if (document.getElementById('autoscale').checked) {
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
    chart.yScale.domain(d3.extent([].concat.apply([], values)))
    chart.data({
            x: times,
            y: values
        })
        .yLabel(app.models.record_labels[data.nodes[2].record_from])
        .update();
}

function drag() {
    $('#autoscale').prop('checked', false)
    var xlim0 = chart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = chart.xScale.range();
    var dx = d3.event.dx * xx / (xs[1] - xs[0]);
    chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    update()
}

function zoom() {
    $('#autoscale').prop('checked', false)
    var xlim0 = chart.xScale.domain();
    // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
    var xx = (xlim0[0] + xlim0[1]) / 2;
    var k = d3.event.transform.k;
    chart.xScale.domain([xx - xx / k, xx + xx / k])
    update()
}

function simulate() {
    layout.restart()
    if (running) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return
    if (data.nodes[0].params.stop == data.sim_time) {
        delete data.nodes[0].params.stop
    }
    data.nodes[2].events = {};
    app.request.simulate({
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
            app.models.get_recordables_list(data.nodes[2])
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
    if (!(running)) return
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return
    window.dataEvents = data.nodes[2].events
    data.nodes[2].events = {};
    app.request.resume({
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
            window.dataEvents = null;
            update()
            resume()
        })
}

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
        chart.yScale.domain(d3.extent([].concat.apply([], values)))
    }
    chart.data({
            x: times,
            y: values
        })
        .yLabel(app.models.record_labels[selected_node.record_from] || 'a.u.')
        .update();
})

app.navigation.init_button(simulate)
app.events.eventHandler(simulate, resume, update)
