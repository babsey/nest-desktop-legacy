"use strict"

const colorbrewer = require('colorbrewer');

var trace = {}

trace.update = (recorder) => {
    var chart = app.graph.chart;
    var lineChart = trace.lineChart;
    var dataModel = app.config.nest('data');

    lineChart.data = {
        x: [],
        y: [],
        n: 1
    };

    if (recorder.events.senders.length == 0) {
        trace.update(recorder)
        return
    }

    if (document.getElementById('autoscale').checked && !app.resizing) {
        lineChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }
    // Get default record_from (e.g. V_m) if it is empty
    if (recorder.node.data_from.length == 0) {
        recorder.node.data_from = recorder.node.params.record_from.filter(
            (record_from) => record_from.indexOf('V_m') != -1
        )
    }

    lineChart.data.y = [].concat.apply([], recorder.data.map(
        (d) => recorder.node.data_from.map(
            (label) => d[label].filter(
                (d, i) => chart.data[chart.abscissa][i] > chart.xScale.domain()[0] && chart.data[chart.abscissa][i] <= chart.xScale.domain()[1]
            )
        )
    ))

    lineChart.data.x = recorder.data.map(
        (d) => d[chart.abscissa].filter(
            (dd) => dd > chart.xScale.domain()[0] && dd <= chart.xScale.domain()[1])
    )[0]

    if (recorder.node.data_from.length == 1) {
        lineChart.data.c = recorder.data.map((d) => d.color)
        lineChart.data.legend = null
    } else if (recorder.node.data_from.length > 1) {
        var colors = colorbrewer['Dark2'][3]
        lineChart.data.c = recorder.node.data_from.map((r, i) => colors[i])
        lineChart.data.legend = recorder.node.data_from.map((r, i) => (dataModel[r].legends || dataModel[r].label))
    }
    lineChart.data.n = recorder.node.series == 'overlap' ? 1 : (recorder.senders.length * recorder.node.data_from.length)

    lineChart.update(recorder);
}

trace.init = (idx) => {

    var height = app.graph.chart.height / app.simulation.recorders.length;
    trace.lineChart = require('./chart/line-chart');
    delete require.cache[require.resolve('./chart/line-chart')]
    trace.lineChart.init('#chart', idx, {
        y: height * idx,
        height: height,
    });
}

module.exports = trace
