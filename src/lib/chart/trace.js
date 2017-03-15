"use strict"

var trace = {}

trace.update = function(output) {
    if (output.events.senders.length == 0) return

    var source = d3.merge(app.data.links.filter(function(link) {
        return link.target == output.node.id
    }).map(function(link) {
        return app.data.nodes[link.source].ids
    }))

    var colors = app.chart.colors();
    var c = d3.merge(app.data.links.filter(function(link) {
        return link.target == output.node.id
    }).map(function(link) {
        return app.format.fillArray(colors[app.data.nodes[link.source].id % colors.length], app.data.nodes[link.source].ids.length)
    }))

    output.data = {
        x: [],
        y: source.map(function() {
            return []
        }),
        c: c
    }

    var lineChart = trace.lineChart;
    if (document.getElementById('autoscale').checked) {
        lineChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }

    output.events.senders.map(function(d, i) {
        if ((output.events.times[i] >= app.chart.xScale.domain()[0]) && (output.events.times[i] < app.chart.xScale.domain()[1])) {
            var idx = source.indexOf(d)
            output.data.y[idx].push(output.events[output.node.record_from][i])
            if (idx==0) {
                output.data.x.push(output.events.times[i])
            }
        }
    });
    app.chart.yLabel(lineChart, app.model.record_labels[output.node.record_from])
    lineChart.update(output.data);
}

trace.init = function(idx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / app.simulation.outputs.length;
    trace.lineChart = require(__dirname + '/core/line-chart');
    delete require.cache[require.resolve(__dirname + '/core/line-chart')]
    trace.lineChart.init('#dataChart', {
        y: height * idx,
        height: height,
    });
}

module.exports = trace
