"use strict"

var rasterPlot = {};

rasterPlot.update = (recorder) => {
    // console.log('Update raster plot')
    if (!recorder.events) return

    var chart = app.graph.chart;
    var colors = app.graph.colors();
    var subchart = recorder.node.subchart || {
        view: 'bar',
        nbins: 100
    };
    subchart.data = subchart.data || 'psth';

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
        return colors[gids[d] % colors.length]
    })

    var scatterChart = rasterPlot.subcharts[0];
    scatterChart.data = {
        x: x,
        y: y,
        c: c,
    }
    scatterChart.axis = {
        x: app.graph.chart.dataModel.times || {},
        y: app.graph.chart.dataModel.neuron_id || {},
    };

    if (subchart.data == 'psth') {
        var abscissa = 'times';
        var ordinate = subchart.ordinate || 'spike_count';

        var nbins = recorder.node.subchart.nbins || 100;
        var xTicks = chart.xScale.ticks(nbins);
        var histogram = d3.histogram()
            .domain(chart.xScale.domain())
            .thresholds(xTicks);

        if (subchart.view == 'bar') {
            var xData = x;
            if (app.selected_node) {
                xData = recorder.sources.indexOf(app.selected_node.id) != -1 ? x.filter((d, i) => app.selected_node.ids.indexOf(y[i]) != -1) : x;
            }
            var hist = histogram(xData)
            var data = hist.slice(0, hist.length - 1).map((h) => {
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
        } else if (subchart.view == 'line') {
            var xData = recorder.sources.map((d) => x.filter((dd, ii) => app.data.nodes[d].ids.indexOf(y[ii]) != -1));
            var hist = xData.map((d) => histogram(d));
            var data = hist.map((h, i) => h.slice(0, h.length - 1).map((hh) => {
                var source = app.data.nodes[recorder.sources[i]]
                var dx = hh.x1 - hh.x0;
                var y = ordinate == 'rate' ? hh.length * 1000. / dx / source.ids.length : hh.length;
                return y
            }));
        }
    } else if (subchart.data == 'isi') {
        var abscissa = 'isi';
        var ordinate = subchart.ordinate || 'count_normed';

        var senders = app.selected_node ? recorder.senders.filter(
            (d) => app.selected_node.element_type == 'neuron' ? app.selected_node.ids.indexOf(d) != -1 : true) : recorder.senders;

        var ISI = [];
        senders.map(
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

        var nbins = recorder.node.subchart.nbins || 100;
        var xTicks = xDomain.ticks(nbins);
        var histogram = d3.histogram()
            .domain(xDomain.domain())
            .thresholds(xTicks)

        if (subchart.view == 'bar') {
            var hist = histogram(ISI_pooled);

            var data = hist.map((h) => {
                h.x = (h.x1 + h.x0) / 2.0;
                h.y = ordinate == 'count_normed' ? parseFloat(h.length) / ISI_pooled.length : h.length;
                return h
            });
        } else {
            var ISI_nodes = recorder.sources.map((d) => d3.merge(ISI.filter(
                (dd, ii) => app.data.nodes[d].ids.indexOf(senders[ii]) != -1)));
            var hist = ISI_nodes.map((ISI_node) => histogram(ISI_node));

            var data = hist.map((h, i) => h.slice(0, h.length - 1).map((hh) => {
                hh.x = (hh.x1 + hh.x0) / 2.0;
                var y = ordinate == 'count_normed' ? parseFloat(hh.length) / ISI_nodes[i].length : hh.length;
                return y
            }));
        }

        var axis = {
            mean: d3.mean(ISI_pooled),
            deviation: nbins > 1 ? d3.deviation(ISI_pooled) : 0,
            unit: app.graph.chart.dataModel[abscissa].unit,
        };

    }

    if (data) {
        if (subchart.view == 'bar') {
            var barChart = rasterPlot.subcharts[1];
            barChart.recId = recorder.node.id;
            barChart.data = data;
            barChart.axis = {
                x: app.graph.chart.dataModel[abscissa] || {},
                y: app.graph.chart.dataModel[ordinate] || {},
                data: axis,
            };
            barChart.data.color = colors[(recorder.sources.length == 1 ? recorder.sources[0] : recorder.node.id) % colors.length];
            if (recorder.sources.length > 1 && app.selected_node) {
                if (app.selected_node.element_type == 'neuron') {
                    barChart.data.color = colors[(recorder.sources.indexOf(app.selected_node.id) != -1 ? app.selected_node.id : recorder.node.id) % colors.length]
                }
            }

            barChart.axis.y.format = ordinate.endsWith('count') ? 0 : 1;
            if (subchart.data == 'isi') {
                barChart.axis.x.domain = xDomain.domain();
            }
        } else if (subchart.view == 'line') {
            var dx = xTicks[1] - xTicks[0];
            var lineChart = rasterPlot.subcharts[1];
            lineChart.recId = recorder.node.id;
            lineChart.data = {
                x: xTicks.slice(0, xTicks.length - 1).map((d) => d + (dx / 2)),
                y: data,
                n: 1,
                colors: recorder.sources.map((r) => colors[r % colors.length]),
            };
            lineChart.axis = {
                x: app.graph.chart.dataModel[abscissa] || {},
                y: app.graph.chart.dataModel[ordinate] || {},
            };
            lineChart.axis.y.format = (ordinate.endsWith('count') ? 0 : 1);
            if (subchart.data == 'isi') {
                lineChart.axis.x.domain = xDomain.domain();
            }
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
