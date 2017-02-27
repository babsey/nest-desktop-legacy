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
        scatterchart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
        barchart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
        barchart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
    }
    var times = recNode.events['times']
    var senders = recNode.events['senders'].filter(function(d, i) {
        return times[i] > scatterchart.xScale.domain()[0] && times[i] < scatterchart.xScale.domain()[1]
    })
    var times = times.filter(function(d) {
        return d > scatterchart.xScale.domain()[0] && d < scatterchart.xScale.domain()[1]
    })

    scatterchart.yScale.domain([0, d3.max(source)])
    scatterchart.data({
            x: times,
            y: senders
        })
        .update();
    var nbins = recNode.nbins || 100
    barchart.nbins(nbins).npop(source.length)
    var histogram = d3.histogram()
        .domain(barchart.xScale.domain())
        .thresholds(barchart.xScale.ticks(nbins));
    var psth = histogram(recNode.events['times']);
    recNode.events.psth = psth;
    barchart.yScale.domain([0, d3.max(psth, function(d) {
        return barchart.yVal(d.length)
    })])
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
        scatterchart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
        barchart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
        rasterPlot.update(recNode)
    }

    function zoom() {
        $('#autoscale').prop('checked', false)
        var xlim0 = scatterchart.xScale.domain();
        // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
        var xx = (xlim0[0] + xlim0[1]) / 2;
        var k = d3.event.transform.k;
        scatterchart.xScale.domain([xx - xx / k, xx + xx / k])
        barchart.xScale.domain([xx - xx / k, xx + xx / k])
        rasterPlot.update(recNode)
    }

    var height = parseInt($('#chart').attr('height')) / noutputs
    // $('#chart').empty()
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
