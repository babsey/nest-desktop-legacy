"use strict"

var heatmap = {};


heatmap.update = function(recNode) {
    if (recNode.events.senders.length == 0) return

    var source = d3.merge(app.data.links.filter(function(link) {
        return link.target == recNode.id
    }).map(function(link) {
        return app.data.nodes[link.source].ids
    }))

    var times = recNode.events['times'];
    var senders = recNode.events['senders'].filter(function(d, i) {
        return times[i] > (app.data.kernel.time - 100)
    })
    recNode.events['senders'] = senders
    recNode.events['times'] = times.filter(function(d, i) {
        return times[i] > (app.data.kernel.time - 100)
    })

    var h1 = d3.histogram()
        .domain(d3.extent(source))
        .thresholds(source)(senders);
    var h1 = h1.map(function(d) {
        return d.length * 1
    })
    $('#clip').empty()
    var sourceId = app.data.links.find(function(x) {
        return x.target == recNode.id
    }).source
    heatmap.chart.xScale.domain([0, app.data.nodes[sourceId].nrow])
    heatmap.chart.yScale.domain([0, app.data.nodes[sourceId].ncol])
    heatmap.chart.colorScale.domain([0, 5])
    heatmap.chart.data({
            i: d3.range(0, h1.length),
            x: d3.range(0, app.data.nodes[sourceId].ncol),
            y: d3.range(0, app.data.nodes[sourceId].nrow),
            c: h1,
        })
        .update();

    $('#simulation-add').attr('disabled', false)
    $('#simulation-resume').attr('disabled', false)
}

heatmap.init = function(recNode, noutputs, cidx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / noutputs
    heatmap.chart = app.chart.heatmapChart('#dataChart',  {
        y: height * cidx,
        height: height,
    });
    app.simChart.xAxis(heatmap.chart);
    app.simChart.yAxis(heatmap.chart);
    app.simChart.xLabel(heatmap.chart, 'Neuron Row ID');
    app.simChart.yLabel(heatmap.chart, 'Neuron Col ID');
}

module.exports = heatmap;
