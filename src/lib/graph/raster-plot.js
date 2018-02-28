"use strict"

var rasterPlot = {};

rasterPlot.update = (recorder) => {
    // console.log('Update raster plot')
    if (!recorder.events) return

    var chart = app.graph.chart;
    var colors = app.graph.colors();
    var subchart = recorder.node.subchart || {};

    var gids = {};
    app.data.nodes.map((node) => {
        if (!node.ids) return
        return node.ids.map((id) => {
            gids[id] = node.id
        })
    })

    var x = recorder.events.times.filter(
        (d) => d > chart.xScale.domain()[0] && d < chart.xScale.domain()[1]
    )
    var y = recorder.events.senders.filter(
        (d, i) => recorder.events.times[i] > chart.xScale.domain()[0] &&
        recorder.events.times[i] < chart.xScale.domain()[1]
    )
    var c = y.map((d) => {
        var colors = app.graph.colors();
        return colors[gids[d] % colors.length]
    })

    var scatterChart = rasterPlot.subcharts[0];
    scatterChart.data = {
        x: x,
        y: y,
        c: c,
    }
    scatterChart.axis = {
        x: app.graph.chart.dataModel['times'] || {},
        y: app.graph.chart.dataModel['neuron_id'] || {},
    };


    if (subchart.data == 'psth') {
        var abscissa = 'times';
        var ordinate = subchart.ordinate || 'spike_count';

        var nbins = recorder.node.subchart.nbins || 100;
        var histogram = d3.histogram()
            .domain(chart.xScale.domain())
            .thresholds(chart.xScale.ticks(nbins));

        var hist = histogram(x);
        var data = hist.map((h) => {
            h.x = (h.x1 + h.x0) / 2.0;
            var dx = h.x1 - h.x0;
            h.y = ordinate == 'rate' ? h.length * 1000. / dx / recorder.senders.length : h.length;
            return h
        });

        var counts_total = data.map((d) => d.y);
        var axis = {
            mean: d3.mean(counts_total),
            deviation: nbins > 1 ? d3.deviation(counts_total) : 0,
            unit: app.graph.chart.dataModel[ordinate].unit,
        };
    } else
    if (subchart.data == 'isi') {
        var abscissa = 'isi';
        var ordinate = 'count';

        var ISI = [];
        recorder.senders.map(
            (sender, sidx) => {
                var times = x;
                var senders = y;
                var timesSender = times.filter(
                    (time, i) => senders[i] == sender
                )
                if (timesSender.length < 2) return
                var ISISender = app.math.delta(timesSender);
                ISISender.idx = sidx;
                ISI.push(ISISender)
            }
        )
        var ISI_pooled = d3.merge(ISI);

        var xDomain = d3.scaleLinear()
            .rangeRound([0, chart.width])
            .domain([0, d3.max(ISI_pooled) || 1])
            .nice();

        var nbins = recorder.node.subchart.nbins || 100
        var histogram = d3.histogram()
            .domain(xDomain.domain())
            .thresholds(xDomain.ticks(nbins))

        var hist = histogram(ISI_pooled);
        var data = hist.map((h, i) => {
            h.x = (h.x1 + h.x0) / 2.0;
            h.y = h.length;
            return h
        });

        var axis = {
            mean: d3.mean(ISI_pooled),
            deviation: nbins > 1 ? d3.deviation(ISI_pooled) : 0,
            unit: app.graph.chart.dataModel[abscissa].unit,
        };

    }

    if (subchart.view == 'bar') {
        var barChart = rasterPlot.subcharts[1];
        barChart.recId = recorder.node.id;
        barChart.data = data;
        barChart.axis = {
            x: app.graph.chart.dataModel[abscissa],
            y: app.graph.chart.dataModel[ordinate],
            data: axis,
        };
        barChart.axis.y.format = ordinate.endsWith('count') ? 0 : 1;
        if (subchart.data == 'isi') {
            barChart.axis.x.domain = xDomain.domain();
        }

    } else
    if (subchart.view == 'line') {
        var lineChart = rasterPlot.subcharts[1];
        lineChart.recId = recorder.node.id;
        var y = data.map((d) => d.y);
        lineChart.data = {
            x: data.map((d) => d.x),
            y: [y],
            n: 1,
        };
        lineChart.axis = {
            x: app.graph.chart.dataModel[abscissa],
            y: app.graph.chart.dataModel[ordinate],
        };
        lineChart.axis.y.format = (ordinate.endsWith('count') ? 0 : 1);
        if (subchart.data == 'isi') {
            lineChart.axis.x.domain = xDomain.domain();
        }
    }

    for (var idx in rasterPlot.subcharts) {
        var subchart = rasterPlot.subcharts[idx];
        if (document.getElementById('autoscale').checked) {
            subchart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
        }
        subchart.update(recorder);
    }
}

rasterPlot.init = (recorder) => {

    var height = app.graph.chart.height / app.simulation.recorders.length;
    var subchart = recorder.node.subchart || {};
    var chartRatio = subchart.view == 'none' || subchart.view == undefined ? 1. : .7;

    rasterPlot.subcharts = [];
    var scatterChart = require('./chart/scatter-chart');
    scatterChart.idx = 0;
    var options = {
        y: height * recorder.idx,
        height: height * chartRatio,
    };
    scatterChart.init(recorder, options);
    rasterPlot.subcharts.push(scatterChart)
    delete require.cache[require.resolve('./chart/scatter-chart')]

    if (subchart.view == 'bar') {
        var barChart = require('./chart/bar-chart');
        barChart.idx = 1;
        var options = {
            y: height * (chartRatio + recorder.idx),
            height: height * (1. - chartRatio)
        };
        barChart.init(recorder, options);
        rasterPlot.subcharts.push(barChart)
        delete require.cache[require.resolve('./chart/bar-chart')]
    }
    if (subchart.view == 'line') {
        var lineChart = require('./chart/line-chart');
        lineChart.idx = 1;
        var options = {
            y: height * (chartRatio + recorder.idx),
            height: height * (1. - chartRatio),
        }
        lineChart.init(recorder, options);
        rasterPlot.subcharts.push(lineChart)
        delete require.cache[require.resolve('./chart/line-chart')]
    }

}


module.exports = rasterPlot;
