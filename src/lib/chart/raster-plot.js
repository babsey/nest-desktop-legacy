"use strict"

var rasterPlot = {}

rasterPlot.update = function(recorder) {
    var scatterChart = rasterPlot.scatterChart;
    var barChart = rasterPlot.barChart;
    recorder.data = {
        dots: {
            x: [],
            y: [],
        },
        bars: [],
    }
    if (recorder.events.senders.length == 0) {
        rasterPlot.scatterChart.update(recorder);
        rasterPlot.barChart.update(recorder);
        return
    }

    var nbins = recorder.node.nbins || 100
    var histogram = d3.histogram()
        .domain(app.chart.xScale.domain())
        .thresholds(app.chart.xScale.ticks(nbins));

    var gids = {}
    app.data.nodes.map(function(node) {
        if (!node.ids) return
        return node.ids.map(function(id) {
            gids[id] = node.id
        })
    })

    barChart.recId = recorder.node.id;
    if (document.getElementById('autoscale').checked) {
        scatterChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
        barChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }
    var times = recorder.events['times']
    var senders = recorder.events['senders'].filter(function(d, i) {
        return times[i] > app.chart.xScale.domain()[0] && times[i] < app.chart.xScale.domain()[1]
    })
    var times = times.filter(function(d) {
        return d > app.chart.xScale.domain()[0] && d < app.chart.xScale.domain()[1]
    })

    var c = senders.map(function(d) {
        var colors = app.chart.colors()
        return colors[gids[d] % colors.length]
    })

    recorder.data.dots = {
        x: times,
        y: senders,
        c: c
    }

    scatterChart.yScale.domain([d3.max(recorder.senders)+1, d3.min(recorder.senders)-1])
    scatterChart.update(recorder);

    var hist = recorder.senders.map(function(s) {
            return histogram(recorder.events['times'].filter(function(d, i) {
                return recorder.events['senders'][i] == s
            }))
        })
        // var psth = hist.map(function(d) {
        //     return d.map(function(dd) {
        //         return dd.length
        //     })
        // })
    recorder.data.bars = hist[0].map(function(col, i) {
        var h = hist.map(function(row) {
            return row[i].length
        })
        h.x0 = col.x0
        h.x1 = col.x1
        h.total = h.reduce(function(acc, val) {
            return acc + val
        })
        return h
    });
    // console.log(psth)
    // var hist = histogram(recorder.events['times']);
    // var psth = hist.map(function(d) {
    //     return {total: d.length}
    // })
    // var x = hist.map(function(d) {
    //     return {
    //         x0: d.x0,
    //         x1: d.x1
    //     }
    // })

    // var colors = app.chart.colors();
    // var c = d3.merge(app.data.links.filter(function(link) {
    //     return link.target == recorder.id
    // }).map(function(link) {
    //     return app.format.fillArray(colors[app.data.nodes[link.source].id % colors.length], app.data.nodes[link.source].ids.length)
    // }))
    // app.simulation.data = {
    //     x: x,
    //     y: psth,
    //     // c: c
    // };

    barChart.update(recorder)

    // var linechart = rasterPlot.linechart;
    // linechart.yScale.domain(d3.extent([].concat.apply([], app.simulation.data.y.map(function(d) {return d.total}))))
    // linechart.xScale.domain(app.chart.xScale.domain())
    // linechart.data(app.simulation.data)
    //     // .yLabel(app.model.record_labels[recorder.record_from])
    //     // .yLabel(app.model.record_labels[app.selected_node.record_from] || 'a.u.')
    //     .update();
}

rasterPlot.init = function(idx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / app.simulation.recorders.length
    rasterPlot.scatterChart = require(__dirname + '/core/scatter-chart');
    rasterPlot.scatterChart.init('#dataChart', {
        y: height * idx,
        height: height * 7. / 10.,
    });
    delete require.cache[require.resolve(__dirname + '/core/scatter-chart')]
    rasterPlot.barChart = require(__dirname + '/core/bar-chart');
    rasterPlot.barChart.init('#dataChart', {
        y: height * (7. / 10. + idx),
        height: height * 3. / 10.,
    });
    delete require.cache[require.resolve(__dirname + '/core/bar-chart')]

    //
    // var linechart = app.chart.lineChart('#dataChart', {
    //     y: height * (7. / 10. + cidx),
    //     height: height * 3. / 10.,
    // });
    // rasterPlot.linechart = linechart;
    // linechart.xAxis(linechart.xScale)
    //     .yAxis(linechart.yScale)
    //     .xLabel('Time [ms]')
    //     .yLabel('Spike count');
    // linechart.onDrag(app.chart.drag);
    // linechart.onZoom(app.chart.zoom);
}


module.exports = rasterPlot;
