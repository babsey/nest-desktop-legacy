"use strict"

var rasterPlot = {}

rasterPlot.update = function(recNode) {
    if (recNode.events.senders.length == 0) return

    var source = d3.merge(app.data.links.filter(function(link) {
        return link.target == recNode.id
    }).map(function(link) {
        return app.data.nodes[link.source].ids
    }))

    var scatterchart = rasterPlot.scatterchart;
    var barchart = rasterPlot.barchart;
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

    scatterchart.yScale.domain([d3.max(source)+1, 0])
    scatterchart.xScale.domain(app.simChart.xScale.domain())
    scatterchart.data({
            x: times,
            y: senders
        })
        .update();
    var nbins = recNode.nbins || 100
    barchart.nbins(nbins).npop(source.length)
    var histogram = d3.histogram()
        .domain(app.simChart.xScale.domain())
        .thresholds(app.simChart.xScale.ticks(nbins));
    var psth = histogram(recNode.events['times']);
    recNode.events.psth = psth;
    barchart.yScale.domain([0, d3.max(psth, function(d) {
        return barchart.yVal(d.length)
    })])
    barchart.xScale.domain(app.simChart.xScale.domain())
    barchart.data(psth).update()

    if (app.layout) {
        app.layout.restart()
    }
    $('#simulation-add').attr('disabled', false)
    $('#simulation-resume').attr('disabled', false)
}

rasterPlot.init = function(recNode, noutputs, cidx) {

    function drag() {
        $('#autoscale').prop('checked', false)
        var xlim0 = scatterchart.xScale.domain();
        var xx = xlim0[1] - xlim0[0];
        var xs = scatterchart.xScale.range();
        var dx = d3.event.dx * xx / (xs[1] - xs[0]);
        app.simChart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
        app.simChart.update()
    }

    function zoom() {
        $('#autoscale').prop('checked', false)
        var xlim0 = scatterchart.xScale.domain();
        // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
        var xx = (xlim0[0] + xlim0[1]) / 2;
        var k = d3.event.transform.k;
        app.simChart.xScale.domain([xx - xx / k, xx + xx / k])
        app.simChart.update()
    }

    // $('#chart').empty()
    var height = parseInt($('#chart').attr('height')) / noutputs
    var scatterchart = app.chart.scatterChart('#chart', {
        y: height * cidx,
        height: height * 7. / 10.,
    });
    rasterPlot.scatterchart = scatterchart;
    scatterchart
        .xAxis(scatterchart.xScale)
        .yAxis(scatterchart.yScale)
        .yLabel('Neuron ID');
    scatterchart.onDrag(drag);
    scatterchart.onZoom(zoom);

    var barchart = app.chart.barChart('#chart', {
        y: height * (7. / 10. + cidx),
        height: height * 3. / 10.,
    });
    rasterPlot.barchart = barchart;
    barchart.xAxis(barchart.xScale)
        .yAxis(barchart.yScale)
        .xLabel('Time [ms]')
        .yLabel('Spike count');
    barchart.onDrag(drag);
    barchart.onZoom(zoom);
}


module.exports = rasterPlot;
