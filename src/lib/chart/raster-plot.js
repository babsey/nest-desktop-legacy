"use strict"

var rasterPlot = {}

rasterPlot.update = function(recorder) {
    var scatterChart = rasterPlot.scatterChart;
    var barChart = rasterPlot.barChart;
    var lineChart = rasterPlot.lineChart;

    scatterChart.data = {
        x: [],
        y: []
    };
    barChart.data = [];
    lineChart.data = {
        x: [],
        y: [],
        n: 1
    };

    if (recorder.events.senders.length == 0) {
        scatterChart.update(recorder);
        barChart.update(recorder);
        lineChart.update(recorder);
        return
    }

    var nbins = recorder.node.nbins || 100;
    var histogram = d3.histogram()
        .domain(app.chart.xScale.domain())
        .thresholds(app.chart.xScale.ticks(nbins));

    var gids = {};
    app.data.nodes.map(function(node) {
        if (!node.ids) return
        return node.ids.map(function(id) {
            gids[id] = node.id
        })
    })

    var times = recorder.events.times;

    scatterChart.data.y = recorder.events.senders.filter(function(d, i) {
        return times[i] > app.chart.xScale.domain()[0] && times[i] < app.chart.xScale.domain()[1]
    })
    scatterChart.data.x = times.filter(function(d) {
        return d > app.chart.xScale.domain()[0] && d < app.chart.xScale.domain()[1]
    })
    scatterChart.data.c = scatterChart.data.y.map(function(d) {
        var colors = app.chart.colors();
        return colors[gids[d] % colors.length]
    })
    if (document.getElementById('autoscale').checked) {
        scatterChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }

    var hist = recorder.senders.map(function(s) {
        return histogram(recorder.events.times.filter(function(d, i) {
            return recorder.events.senders[i] == s
        }))
    })
    var psth = hist[0].map(function(col, i) {
        var h = hist.map(function(row) {
            return row[i].length
        })
        h.x0 = col.x0
        h.x1 = col.x1
        h.x = (h.x1 + h.x0) / 2.0
        h.total = h.reduce(function(acc, val) {
            return acc + val
        })
        var dx = h.x1 - h.x0;
        h.y = h.total * (recorder.node.record_from == 'rate' ? 1000. / dx / h.length : 1)
        return h
    });

    if (recorder.node.psth == 'line') {
        lineChart.data = {
            x: psth.map(function(d) {
                return d.x
            }),
            y: [psth.map(function(d) {
                return d.y
            })],
            n: 1,
            c: ['steelblue']
        }
    } else {
        barChart.recId = recorder.node.id;
        if (document.getElementById('autoscale').checked) {
            barChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
        }
        barChart.data = psth
    }

    scatterChart.update(recorder);
    lineChart.update(recorder);
    barChart.update(recorder)
}

rasterPlot.init = function(idx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / app.simulation.recorders.length

    rasterPlot.scatterChart = require(__dirname + '/core/scatter-chart');
    rasterPlot.scatterChart.init('#dataChart', idx, {
        y: height * idx,
        height: height * 7. / 10.,
    });
    delete require.cache[require.resolve(__dirname + '/core/scatter-chart')]

    rasterPlot.barChart = require(__dirname + '/core/bar-chart');
    rasterPlot.barChart.init('#dataChart', idx, {
        y: height * (7. / 10. + idx),
        height: height * 3. / 10.,
    });
    delete require.cache[require.resolve(__dirname + '/core/bar-chart')]

    rasterPlot.lineChart = require(__dirname + '/core/line-chart');
    rasterPlot.lineChart.init('#dataChart', idx, {
        y: height * (7. / 10. + idx),
        height: height * 3. / 10.,
    });
    delete require.cache[require.resolve(__dirname + '/core/line-chart')]

}


module.exports = rasterPlot;
