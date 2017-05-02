"use strict"

const colorbrewer = require('colorbrewer');

var trace = {}

trace.update = function(recorder) {

    var lineChart = trace.lineChart;
    lineChart.data = {x:[],y:[],n:1};

    if (recorder.events.senders.length == 0) {
        trace.update(recorder)
        return
    }

    if (document.getElementById('autoscale').checked) {
        lineChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }
    // Get default record_from (e.g. V_m) if it is empty
    if (recorder.node.record_from.length == 0) {
        recorder.node.record_from = recorder.node.params.record_from.filter(function(record_from) {
            return record_from.indexOf('V_m') != -1
        })
    }

    lineChart.data.y = [].concat.apply([], recorder.data.map(function(d) {
        return recorder.node.record_from.map(function(r) {
            return d[r].filter(function(d, i) {
                return app.chart.data[app.chart.abscissa][i] > app.chart.xScale.domain()[0] && app.chart.data[app.chart.abscissa][i] <= app.chart.xScale.domain()[1]
            })
        })
    }))
    lineChart.data.x = recorder.data.map(function(d) {
        return d[app.chart.abscissa].filter(function(dd) {
            return dd > app.chart.xScale.domain()[0] && dd <= app.chart.xScale.domain()[1]
        })
    })[0]
    if (recorder.node.record_from.length == 1) {
        lineChart.data.c = recorder.data.map(function(d) {
            return d.color
        })
        lineChart.data.legend = null
    } else if (recorder.node.record_from.length > 1) {
        var colors = colorbrewer['Dark2'][3]
        lineChart.data.c = recorder.node.record_from.map(function(r, i) {
            return colors[i]
        })
        lineChart.data.legend = recorder.node.record_from.map(function(r, i) {
            return app.model.record_legends[r]
        })
    }
    lineChart.data.n = recorder.node.series == 'overlap' ? 1 : (recorder.senders.length * recorder.node.record_from.length)

    lineChart.update(recorder);
}

trace.init = function(idx) {

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
