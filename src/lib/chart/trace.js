"use strict"

const colorbrewer = require('colorbrewer');

var trace = {}

trace.update = (recorder) => {

    var lineChart = trace.lineChart;
    lineChart.data = {
        x: [],
        y: [],
        n: 1
    };

    if (recorder.events.senders.length == 0) {
        trace.update(recorder)
        return
    }

    if (document.getElementById('autoscale').checked) {
        lineChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }
    // Get default record_from (e.g. V_m) if it is empty
    if (recorder.node.record_from.length == 0) {
        recorder.node.record_from = recorder.node.params.record_from.filter(
            (record_from) => record_from.indexOf('V_m') != -1
        )
    }

    lineChart.data.y = [].concat.apply([], recorder.data.map(
        (d) => recorder.node.record_from.map(
            (r) => d[r].filter(
                (d, i) => app.chart.data[app.chart.abscissa][i] > app.chart.xScale.domain()[0] && app.chart.data[app.chart.abscissa][i] <= app.chart.xScale.domain()[1]
            )
        )
    ))
    lineChart.data.x = recorder.data.map(
        (d) => d[app.chart.abscissa].filter(
            (dd) => dd > app.chart.xScale.domain()[0] && dd <= app.chart.xScale.domain()[1])
    )[0]
    if (recorder.node.record_from.length == 1) {
        lineChart.data.c = recorder.data.map((d) => d.color)
        lineChart.data.legend = null
    } else if (recorder.node.record_from.length > 1) {
        var colors = colorbrewer['Dark2'][3]
        lineChart.data.c = recorder.node.record_from.map((r, i) => colors[i])
        lineChart.data.legend = recorder.node.record_from.map((r, i) => app.model.record_legends[r])
    }
    lineChart.data.n = recorder.node.series == 'overlap' ? 1 : (recorder.senders.length * recorder.node.record_from.length)

    lineChart.update(recorder);
}

trace.init = (idx) => {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / app.simulation.recorders.length;
    trace.lineChart = require(__dirname + '/core/line-chart');
    delete require.cache[require.resolve(__dirname + '/core/line-chart')]
    trace.lineChart.init('#dataChart', idx, {
        y: height * idx,
        height: height,
    });
}

module.exports = trace
