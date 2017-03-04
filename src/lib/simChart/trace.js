"use strict"

var trace = {}

trace.update = function(recNode) {
    if (recNode.events.senders.length == 0) return

    var source = d3.merge(app.data.links.filter(function(link) {
        return link.target == recNode.id
    }).map(function(link) {
        return app.data.nodes[link.source].ids
    }))

    var colors = app.simChart.colors;
    var c = d3.merge(app.data.links.filter(function(link) {
        return link.target == recNode.id
    }).map(function(link) {
        return app.format.fillArray(colors[app.data.nodes[link.source].id % colors.length], app.data.nodes[link.source].ids.length)
    }))

    app.simulation.data = {
        x: [],
        y: source.map(function() {
            return []
        }),
        c: c
    }

    var linechart = trace.linechart;
    if (document.getElementById('autoscale').checked) {
        linechart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }

    recNode.events.senders.map(function(d, i) {
        if ((recNode.events.times[i] >= app.simChart.xScale.domain()[0]) && (recNode.events.times[i] < app.simChart.xScale.domain()[1])) {
            app.simulation.data.y[d - source[0]].push(recNode.events[recNode.record_from][i])
            if (d == source[0]) {
                app.simulation.data.x.push(recNode.events.times[i])
            }
        }
    });
    linechart.data(app.simulation.data)
    app.simChart.yLabel(linechart, app.model.record_labels[recNode.record_from])
    linechart.update();
}

trace.init = function(recNode, noutputs, cidx) {

    function drag() {
        $('#autoscale').prop('checked', false)
        var xlim0 = linechart.xScale.domain();
        var xx = xlim0[1] - xlim0[0];
        var xs = linechart.xScale.range();
        var dx = d3.event.dx * xx / (xs[1] - xs[0]);
        app.simChart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
        app.simChart.update()
    }

    function zoom() {
        $('#autoscale').prop('checked', false)
        var xlim0 = linechart.xScale.domain();
        // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
        var xx = (xlim0[0] + xlim0[1]) / 2;
        var k = d3.event.transform.k;
        app.simChart.xScale.domain([xx - xx / k, xx + xx / k])
        app.simChart.update()
    }

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / noutputs
    trace.linechart = app.chart.lineChart('#dataChart', {
        y: height * cidx,
        height: height,
    });
}

module.exports = trace
