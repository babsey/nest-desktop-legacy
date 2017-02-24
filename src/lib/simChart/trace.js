"use strict"

var trace = {}

trace.init = function() {

    app.simulation.update = function() {
        var recNode = app.data.nodes.filter(function(node) {
            return node.type == 'output'
        })[0]
        if (recNode.events.senders.length == 0) return

        var source = d3.merge(app.data.links.filter(function(link) {
            return link.target == recNode.id
        }).map(function(link) {
            return app.data.nodes[link.source].ids
        }))

        app.simulation.data = {
            x: [],
            y: source.map(function() {
                return []
            })
        }

        if (document.getElementById('autoscale').checked) {
            linechart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
            linechart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
        }

        recNode.events.senders.map(function(d, i) {
            if ((recNode.events.times[i] >= linechart.xScale.domain()[0]) && (recNode.events.times[i] < linechart.xScale.domain()[1])) {
                app.simulation.data.y[d - source[0]].push(recNode.events[recNode.record_from][i])
                if (d == source[0]) {
                    app.simulation.data.x.push(recNode.events.times[i])
                }
            }
        });
        linechart.yScale.domain(d3.extent([].concat.apply([], app.simulation.data.y)))
        linechart.data(app.simulation.data)
            .yLabel(app.model.record_labels[recNode.record_from])
            // .yLabel(app.model.record_labels[app.selected_node.record_from] || 'a.u.')
            .update();

        if (app.layout) {
            app.layout.restart()
        }

        $('#simulation-add').attr('disabled', false)
        $('#simulation-resume').attr('disabled', false)

    }

    function drag() {
        $('#autoscale').prop('checked', false)
        var xlim0 = linechart.xScale.domain();
        var xx = xlim0[1] - xlim0[0];
        var xs = linechart.xScale.range();
        var dx = d3.event.dx * xx / (xs[1] - xs[0]);
        linechart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
        app.simulation.update()
    }

    function zoom() {
        $('#autoscale').prop('checked', false)
        var xlim0 = linechart.xScale.domain();
        // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
        var xx = (xlim0[0] + xlim0[1]) / 2;
        var k = d3.event.transform.k;
        linechart.xScale.domain([xx - xx / k, xx + xx / k])
        app.simulation.update()
    }

    $('#chart').empty()
    var linechart = app.chart.lineChart('#chart', {});
    trace.linechart = linechart;
    linechart.xAxis(linechart.xScale)
        .yAxis(linechart.yScale)
        .xLabel('Time (ms)');
    linechart
        .onDrag(drag)
        .onZoom(zoom);
}

module.exports = trace
