"use strict"

var rasterPlot = {}

rasterPlot.update = (recorder) => {
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
    app.data.nodes.map((node) => {
        if (!node.ids) return
        return node.ids.map((id) => {
            gids[id] = node.id
        })
    })

    var times = recorder.events.times;

    scatterChart.data.y = recorder.events.senders.filter(
        (d, i) => times[i] > app.chart.xScale.domain()[0] && times[i] < app.chart.xScale.domain()[1]
    )
    scatterChart.data.x = times.filter(
        (d) => d > app.chart.xScale.domain()[0] && d < app.chart.xScale.domain()[1]
    )
    scatterChart.data.c = scatterChart.data.y.map((d) => {
        var colors = app.chart.colors();
        return colors[gids[d] % colors.length]
    })
    if (document.getElementById('autoscale').checked) {
        scatterChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }

    var hist = recorder.senders.map(
        (s) => histogram(recorder.events.times.filter(
            (d, i) => recorder.events.senders[i] == s
        ))
    )
    var psth = hist[0].map((col, i) => {
        var h = hist.map((row) => row[i].length)
        h.x0 = col.x0
        h.x1 = col.x1
        h.x = (h.x1 + h.x0) / 2.0
        h.total = h.reduce((acc, val) => acc + val)
        var dx = h.x1 - h.x0;
        h.y = h.total * (recorder.node.record_from == 'rate' ? 1000. / dx / h.length : 1)
        return h
    });

    if (recorder.node.psth == 'line') {
        lineChart.data = {
            x: psth.map((d) => d.x),
            y: [psth.map((d) => d.y)],
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

rasterPlot.init = (idx) => {

    // $('#chart').empty()
    var height = ( parseInt($('#dataChart').attr('height')) || app.chart.height ) / app.simulation.recorders.length;

    rasterPlot.scatterChart = require(__dirname + '/core/scatter-chart');
    rasterPlot.scatterChart.init('#dataChart', idx, {
        y: height * idx,
        height: height * 7. / 10.
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
