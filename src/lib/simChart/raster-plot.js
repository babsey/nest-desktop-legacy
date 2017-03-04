"use strict"

var rasterPlot = {
    data: {}
}

rasterPlot.update = function(recNode) {
    if (recNode.events.senders.length == 0) {
        rasterPlot.scatterchart.data({
                x: [],
                y: [],
                c: []
            })
            .update();
        rasterPlot.barchart.data([])
            .update();
        return
    }

    var scatterchart = rasterPlot.scatterchart;
    var barchart = rasterPlot.barchart;

    var source = d3.merge(app.data.links.filter(function(link) {
        return link.target == recNode.id
    }).map(function(link) {
        return app.data.nodes[link.source].ids
    }))
    var nbins = recNode.nbins || 100
    var histogram = d3.histogram()
        .domain(app.simChart.xScale.domain())
        .thresholds(app.simChart.xScale.ticks(nbins));

    var gids = {}
    app.data.nodes.map(function(node) {
        return node.ids.map(function(id) {
            gids[id] = node.id
        })
    })

    barchart.recId = recNode.id;
    if (document.getElementById('autoscale').checked) {
        scatterchart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
        barchart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }
    var times = recNode.events['times']
    var senders = recNode.events['senders'].filter(function(d, i) {
        return times[i] > app.simChart.xScale.domain()[0] && times[i] < app.simChart.xScale.domain()[1]
    })
    var times = times.filter(function(d) {
        return d > app.simChart.xScale.domain()[0] && d < app.simChart.xScale.domain()[1]
    })

    var c = senders.map(function(d) {
        return app.simChart.colors[gids[d]]
    })

    scatterchart.yScale.domain([d3.max(source) + 1, 0])
    scatterchart.data({
            x: times,
            y: senders,
            c: c
        })
        .update();


    var hist = source.map(function(s) {
            return histogram(recNode.events['times'].filter(function(d, i) {
                return recNode.events['senders'][i] == s
            }))
        })
        // var psth = hist.map(function(d) {
        //     return d.map(function(dd) {
        //         return dd.length
        //     })
        // })
    app.simulation.data = hist[0].map(function(col, i) {
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
    // var hist = histogram(recNode.events['times']);
    // var psth = hist.map(function(d) {
    //     return {total: d.length}
    // })
    // var x = hist.map(function(d) {
    //     return {
    //         x0: d.x0,
    //         x1: d.x1
    //     }
    // })

    // var colors = app.simChart.colors;
    // var c = d3.merge(app.data.links.filter(function(link) {
    //     return link.target == recNode.id
    // }).map(function(link) {
    //     return app.format.fillArray(colors[app.data.nodes[link.source].id % colors.length], app.data.nodes[link.source].ids.length)
    // }))
    // app.simulation.data = {
    //     x: x,
    //     y: psth,
    //     // c: c
    // };

    barchart.nbins(nbins)
        .npop(source.length)
        .sources(source)
        .data(app.simulation.data)
        .update()

    // var linechart = rasterPlot.linechart;
    // linechart.yScale.domain(d3.extent([].concat.apply([], app.simulation.data.y.map(function(d) {return d.total}))))
    // linechart.xScale.domain(app.simChart.xScale.domain())
    // linechart.data(app.simulation.data)
    //     // .yLabel(app.model.record_labels[recNode.record_from])
    //     // .yLabel(app.model.record_labels[app.selected_node.record_from] || 'a.u.')
    //     .update();
}

rasterPlot.init = function(recNode, noutputs, cidx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / noutputs

    rasterPlot.scatterchart = app.chart.scatterChart('#dataChart', {
        y: height * cidx,
        height: height * 7. / 10.,
    });
    rasterPlot.barchart = app.chart.barChart('#dataChart', {
        y: height * (7. / 10. + cidx),
        height: height * 3. / 10.,
    });
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
    // linechart.onDrag(app.simChart.drag);
    // linechart.onZoom(app.simChart.zoom);
}


module.exports = rasterPlot;
