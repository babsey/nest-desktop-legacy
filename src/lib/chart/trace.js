"use strict"

var trace = {}

trace.update = function(recorder) {
    if (recorder.events.senders.length == 0) return
    var lineChart = trace.lineChart;

    if (document.getElementById('autoscale').checked) {
        lineChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }
    // Get default record_from (e.g. V_m) if it is empty
    if (recorder.node.record_from.length == 0) {
        recorder.node.record_from = recorder.node.params.record_from.filter(function(record_from) {
            return record_from.indexOf('V_m') != -1
        })
    }
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
