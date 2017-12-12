"use strict"

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

var chart = {
    networkLayout: require(__dirname + '/chart/network-layout'),
    fromOutputNode: {
        'voltmeter': 'trace',
        'multimeter': 'trace',
        'spike_detector': 'raster-plot',
    },
    data: {},
    margin: {
        top: 50,
        right: 450,
        bottom: 0,
        left: 0
    }
};

chart.width = window.innerWidth - chart.margin.left - chart.margin.right
chart.height = window.innerHeight - chart.margin.top - chart.margin.bottom

chart.format = d3.format(".2f");

chart.transition = d3.transition()
    .ease(d3.easeLinear);

chart.xAxis = (c) => {
    c.xAxis = d3.axisBottom(c.xScale);
    c.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis yaxis")
        .attr("transform", "translate(0," + c.height + ")")
        .style('font-size', '14px')
        .call(c.xAxis);
}

chart.yAxis = (c) => {
    c.yAxis = d3.axisLeft(c.yScale).ticks(3);
    c.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis yaxis")
        .style('font-size', '14px')
        .attr("transform", "translate(0,0)")
        .call(c.yAxis);
}

chart.xLabel = (c, id, label) => {
    if (!document.getElementById(id)) {
        c.g.append("text")
            .attr("id", id)
            .attr("class", "xlabel label")
            .attr("text-anchor", "middle")
            .attr("x", +c.width / 2)
            .attr("y", +c.height + 30)
            .text("Time (ms)");
    }
    c.g.select("#" + id)
        .text(label);
}

chart.yLabel = (c, id, label) => {
    if (!document.getElementById(id)) {
        c.g.append("text")
            .attr("id", id)
            .attr("class", "ylabel label")
            .attr("transform", "rotate(-90)")
            .attr("x", -1. * +c.yScale.range()[1])
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
    }
    c.g.select("#" + id)
        .attr("x", -1. * +c.yScale.range()[1])
        .text(label);
}

chart.legend = (c, data, color) => {
    c.g.selectAll('.legends').remove()
    if (!data) return

    var width = d3.max(data.map((d) => d.length)) * 9;
    var legend = c.g.append('g')
        .attr('class', 'legends')
        .selectAll('.legend')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', c.width - width)
        .attr('y', (d, i) => i * 20 - 5)
        .attr('width', width)
        .attr('height', 20)
        .style('fill', 'white');

    legend.append('rect')
        .attr('x', c.width - width)
        .attr('y', (d, i) => i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', (d, i) => color[i]);

    legend.append('text')
        .attr('x', c.width - width + 12)
        .attr('y', (d, i) => (i * 20) + 9)
        .text((d) => d);
}

chart.dragstarted = () => {
    chart.dragging = true
}

chart.dragged = () => {
    $('#autoscale').prop('checked', false)
    var xlim0 = app.chart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = app.chart.xScale.range();
    var dx = d3.event.dx * xx / (xs[1] - xs[0]);
    app.chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    app.chart.update()
}

chart.dragended = () => {
    chart.dragging = false
}

chart.onDrag = (d) => {
    var drag = d3.drag()
        .on("start", chart.dragstarted)
        .on("drag", chart.dragged)
        .on("end", chart.dragended)
    d.g.select('#clip')
        .call(drag);
}

chart.zoomstarted = () => {
    chart.zooming = true
}

chart.zoomed = () => {
    $('#autoscale').prop('checked', false)
    var xlim0 = app.chart.xScale.domain();
    // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
    var xx = (xlim0[0] + xlim0[1]) / 2;
    var k = d3.event.transform.k;
    app.chart.xScale.domain([xx - xx / k, xx + xx / k])
    app.chart.update()
}

chart.zoomended = () => {
    chart.zooming = false
}

chart.onZoom = (d) => {
    var zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", chart.zoomstarted)
        .on("zoom", chart.zoomed)
        .on("end", chart.zoomended)
    d.g.select('#clip')
        .call(zoom);
}

chart.axesUpdate = (c, transition) => {
    if (transition) {
        c.g.select('#xaxis')
            .transition(c.transition)
            .call(c.xAxis);
        c.g.select('#yaxis')
            .transition(c.transition)
            .call(c.yAxis);
    } else {
        c.g.select('#xaxis')
            .call(c.xAxis);
        c.g.select('#yaxis')
            .call(c.yAxis);
    }
}

chart.scaling = () => {
    if ($('#autoscale').prop('checked')) {
        if (app.simulation.running || (app.chart.abscissa == 'times')) {
            app.chart.xScale.domain([app.data.kernel.time - (app.data.sim_time || 1000.), app.data.kernel.time])
        } else {
            app.chart.xScale.domain(d3.extent(app.chart.data[app.chart.abscissa])).nice()
            // app.chart.xScale.domain([d3.min(app.chart.data[app.chart.abscissa]) - 0.01, d3.max(app.chart.data[app.chart.abscissa]) + 0.01]).nice()
        }
    }
}

chart.update = () => {
    app.message.log('Update chart')
    if (chart.networkLayout.drawing) return
    chart.scaling()
    app.simulation.recorders.map((recorder) => {
        if (!recorder.node.model) return
        recorder.data = recorder.senders.map((sender, sidx) => {
            var data = {};
            Object.keys(recorder.events).map((d) => {
                data[d] = recorder.events[d].filter(
                    (d, i) => recorder.events.senders[i] == sender
                )
            })
            var links = app.data.links.filter(
                (link) => link.target == recorder.node.id && app.data.nodes[link.source].ids.indexOf(sender) != -1
            )
            if (links.length == 1) {
                var link = links[0]
                data.color = app.chart.colors()[app.data.nodes[link.source].id]
            } else {
                data.color = app.chart.colors()[sidx]
            }
            return data
        })
        recorder.senders.map((sender, sidx) => {
            app.simulation.stimulators.map((stimulator) => {
                Object.keys(stimulator.events).map((ekey) => {
                    recorder.data[sidx][ekey] = stimulator.events[ekey]
                })
            })
        })
        recorder.chart.update(recorder)
    })
}

chart.init = () => {
    app.message.log('Initialize chart')
    chart.zooming = false;
    chart.dragging = false;

    // mouse event vars
    chart.mousedown_link = null;
    chart.mousedown_node = null;
    chart.mouseup_node = null;

    var colors = d3.schemeCategory10;
    // var colors = colorbrewer.RdYlGn;
    // var keys = Object.keys(colors);
    // var colors = colors[keys[keys.length - 1]]

    chart.colors = (id) => {
        if (id != undefined) {
            return colors[id % colors.length]
        }
        return app.data.nodes.map(
            (d) => (d.color || colors[d.id % colors.length])
        )
    }

    $('#chart').attr('width', window.innerWidth).attr('height', chart.height)
    $('#dataChart').attr('width', chart.width)
        .attr('height', chart.height)
    $('#dataChart').empty()

    if (chart.xScale) {
        var xScaleDomain = chart.xScale.domain()
    }
    chart.xScale = d3.scaleLinear();
    chart.xScale.range([chart.margin.left, (+window.innerWidth - chart.margin.right)])
    if (xScaleDomain) {
        chart.xScale.domain(xScaleDomain)
    }

    $('#networkLayout').attr('width', chart.width)
        .attr('height', chart.height)
    $('#networkLayout').empty()
    app.chart.networkLayout.init()

    $('#autoscale').off('click').on('click', app.chart.update)
    window.addEventListener('resize', function() {
        app.resizing = true
        app.chart.init()
        app.chart.update()
        app.controller.update()
        app.resizing = false
    });

}

module.exports = chart;
