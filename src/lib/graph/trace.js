"use strict"

const colorbrewer = require('colorbrewer');

var trace = {};

trace.update = (recorder) => {
    // console.log('Update trace')
    if (!recorder.events) return
    var chart = app.graph.chart;
    var dataModel = app.config.nest('data');
    var subchart = recorder.node.subchart || {};

    if (recorder.events.senders.length == 0) {
        trace.update(recorder)
        return
    }

    // Get default record_from (e.g. V_m) if it is empty
    if (recorder.node.data_from.length == 0) {
        recorder.node.data_from = recorder.node.params.record_from.filter(
            (record_from) => record_from.indexOf('V_m') != -1
        )
    }

    var nodeIndices = d3.merge(app.data.nodes.map((d, i) => Array(d.ids.length).fill(i)));

    var y = [];
    var xDomain = app.graph.chart.xScale.domain();
    var xFull = recorder.data[0].times;
    var x = xFull.filter(
        (d) => d > xDomain[0] && d <= xDomain[1]
    );
    recorder.data.map((data, idx) => {
        recorder.node.data_from.map((data_from) => {
            var yData = data[data_from].filter((d, i) => xFull[i] > xDomain[0] && xFull[i] <= xDomain[1]);
            yData.idx = idx;
            y.push(yData);
        })
    })
    var n = recorder.node.series == 'overlap' ? 1 : (recorder.senders.length * recorder.node.data_from.length);

    var lineChart = trace.subcharts[0];
    lineChart.data = {
        y: y,
        x: x,
        n: n,
    };
    lineChart.data.V_th = {
        x: xDomain,
        y: recorder.senders.map((sender) => {
            var v = app.data.nodes[nodeIndices[sender - 1]].params.V_th;
            return [v, v]
        })
    }

    if (recorder.node.data_from.length == 1) {
        lineChart.data.colors = recorder.data.map((d) => d.color);
        lineChart.data.legend = null;
    } else if (recorder.node.data_from.length > 1) {
        var colors = colorbrewer['Dark2'][3];
        lineChart.data.colors = recorder.node.data_from.map((r, i) => colors[i]);
        lineChart.data.legend = recorder.node.data_from.map((r, i) => (dataModel[r].legends || dataModel[r].label));
    }

    var data_from = $('#record_' + recorder.node.id).val() || 'V_m';

    lineChart.axis = {
        x: app.graph.chart.dataModel.times,
        y: app.graph.chart.dataModel[data_from],
    };

    if (subchart.view == 'bar') {
        var yPooled = d3.merge(lineChart.data.y);
        var xDomain = d3.scaleLinear()
            .rangeRound([0, chart.width])
            .domain(data_from == 'V_m' ? [-70.5, -54.5] : d3.extent(yPooled));

        var nbins = 100;
        var histogram = d3.histogram()
            .domain(xDomain.domain())
            .thresholds(xDomain.ticks(nbins));

        var hist = histogram(yPooled);
        var hdata = hist.map((h) => {
            h.x = (h.x1 + h.x0) / 2.0;
            var dx = h.x1 - h.x0;
            h.y = h.length;
            return h
        });

        var barChart = trace.subcharts[1];
        barChart.recId = recorder.node.id;
        barChart.data = hdata;
        barChart.axis = {
            x: app.graph.chart.dataModel[data_from],
            y: app.graph.chart.dataModel['count'],
            data: {
                mean: d3.mean(yPooled),
                deviation: nbins > 1 ? d3.deviation(yPooled) : 0,
                unit: app.graph.chart.dataModel[data_from].unit,
            }
        };
        barChart.axis.x.domain = xDomain.domain();
    }

    for (var idx in trace.subcharts) {
        var subchart = trace.subcharts[idx];
        if (document.getElementById('autoscale').checked && !app.resizing) {
            subchart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
        }
        subchart.update(recorder);
    }
}

trace.init = (recorder) => {

    var height = app.graph.chart.height / app.simulation.recorders.length;
    var subchart = recorder.node.subchart || {};
    var chartRatio = subchart.view == 'none' || subchart.view == undefined ? 1. : .7;

    trace.subcharts = [];
    var lineChart = require('./chart/line-chart');
    lineChart.idx = 0;
    var options = {
        y: height * recorder.idx,
        height: height * chartRatio,
    }
    lineChart.init(recorder, options);
    trace.subcharts.push(lineChart)
    delete require.cache[require.resolve('./chart/line-chart')]

    if (subchart.view == 'bar') {
        var barChart = require('./chart/bar-chart');
        barChart.idx = 1;
        var options = {
            y: height * (chartRatio + recorder.idx),
            height: height * (1. - chartRatio)
        };
        barChart.init(recorder, options);
        trace.subcharts.push(barChart)
        delete require.cache[require.resolve('./chart/bar-chart')]
    }
}

module.exports = trace
