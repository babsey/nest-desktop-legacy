"use strict"

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

var chart = {
    networkLayout: require(__dirname + '/chart/network-layout'),
    fromOutputNode: {
        'voltmeter': 'trace',
        'multimeter': 'trace',
        'spike_detector': 'raster-plot',
    }
};

chart.format = d3.format(".2f");

chart.transition = d3.transition()
    .ease(d3.easeLinear);

chart.xAxis = function(chart) {
    chart.xAxis = d3.axisBottom(chart.xScale);
    chart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + chart.height + ")")
        .style('font-size', '14px')
        .call(chart.xAxis);
}

chart.yAxis = function(chart) {
    chart.yAxis = d3.axisLeft(chart.yScale).ticks(3);
    chart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .attr("transform", "translate(0,0)")
        .call(chart.yAxis);
}

chart.xLabel = function(chart, label) {
    if (!document.getElementsByTagName("xlabel").length) {
        chart.g.append("text")
            .attr("id", "xlabel")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", +chart.g.attr('width') / 2)
            .attr("y", +chart.g.attr('height') + 30)
            .text("Time (ms)");
    }
    chart.g.select('#xlabel')
        .text(label);
}

chart.yLabel = function(chart, label) {
    if (!document.getElementsByTagName("ylabel").length) {
        chart.g.append("text")
            .attr("id", "ylabel")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -1. * +chart.yScale.range()[1])
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
    }
    chart.g.select('#ylabel')
        .text(label);
}

chart.legend = function(chart, data, color) {
    chart.g.selectAll('.legends').remove()
    if (!app.config.app().chart.color) return

    var width = d3.max(data.map(function(d) {return d.length})) * 9
    var legend = chart.g.append('g')
        .attr('class', 'legends')
        .selectAll('.legend')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', chart.width - width)
        .attr('y', function(d, i) {
            return i * 20 - 5;
        })
        .attr('width', width)
        .attr('height', 20)
        .style('fill', 'white');

    legend.append('rect')
        .attr('x', chart.width - width)
        .attr('y', function(d, i) {
            return i * 20;
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d,i) {
            return color[i];
        });

    legend.append('text')
        .attr('x', chart.width - width + 12)
        .attr('y', function(d, i) {
            return (i * 20) + 9;
        })
        .text(function(d) {
            return d;
        });
}

chart.dragstarted = function() {
    chart.dragging = true
}

chart.dragged = function() {
    $('#autoscale').prop('checked', false)
    var xlim0 = app.chart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = app.chart.xScale.range();
    var dx = d3.event.dx * xx / (xs[1] - xs[0]);
    app.chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    app.chart.update()
}

chart.dragended = function() {
    chart.dragging = false
}

chart.onDrag = function(d) {
    var drag = d3.drag()
        .on("start", chart.dragstarted)
        .on("drag", chart.dragged)
        .on("end", chart.dragended)
    d.g.select('#clip')
        .call(drag);
}

chart.zoomstarted = function() {
    chart.zooming = true
}

chart.zoomed = function() {
    $('#autoscale').prop('checked', false)
    var xlim0 = app.chart.xScale.domain();
    // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
    var xx = (xlim0[0] + xlim0[1]) / 2;
    var k = d3.event.transform.k;
    app.chart.xScale.domain([xx - xx / k, xx + xx / k])
    app.chart.update()
}

chart.zoomended = function() {
    chart.zooming = false
}

chart.onZoom = function(d) {
    var zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", chart.zoomstarted)
        .on("zoom", chart.zoomed)
        .on("end", chart.zoomended)
    d.g.select('#clip')
        .call(zoom);
}

chart.axesUpdate = function(chart, transition) {
    if (transition) {
        chart.g.select('#xaxis')
            .transition(chart.transition)
            .call(chart.xAxis);
        chart.g.select('#yaxis')
            .transition(chart.transition)
            .call(chart.yAxis);
    } else {
        chart.g.select('#xaxis')
            .call(chart.xAxis);
        chart.g.select('#yaxis')
            .call(chart.yAxis);
    }
}

chart.update = function() {
    if (chart.networkLayout.drawing) return
    if ($('#autoscale').prop('checked')) {
        chart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
    }
    app.simulation.recorders.map(function(recorder) {
        if (!recorder.node.model) return
        recorder.chart.update(recorder)
    })
    $('#simulation-add').attr('disabled', false)
    $('#simulation-resume').attr('disabled', false)
    setTimeout(function() {
        app.screen.capture(app.data, false)
    }, 500)
}

chart.init = function() {
    chart.zooming = false;
    chart.dragging = false;

    // mouse event vars
    chart.mousedown_link = null;
    chart.mousedown_node = null;
    chart.mouseup_node = null;

    chart.margin = {
        top: 50,
        right: 350,
        bottom: 0,
        left: 0
    }
    chart.width = window.innerWidth - chart.margin.left - chart.margin.right
    chart.height = window.innerHeight - chart.margin.top - chart.margin.bottom

    $('#chart').attr('width', window.innerWidth).attr('height', chart.height)
    $('#dataChart').attr('width', chart.width)
        .attr('height', chart.height)
    $('#networkLayout').attr('width', chart.width)
        .attr('height', chart.height)
    $('#dataChart').empty()
    $('#networkLayout').empty()

    if (chart.xScale) {
        var xScaleDomain = chart.xScale.domain()
    }
    chart.xScale = d3.scaleLinear();
    chart.xScale.range([chart.margin.left, (+window.innerWidth - chart.margin.right)])
    if (xScaleDomain) {
        chart.xScale.domain(xScaleDomain)
    }

    var colors = d3.schemeCategory10;
    chart.colors = function(id) {
        if (id != undefined) {
            return colors[id % colors.length]
        }
        return app.data.nodes.map(function(d) {
            return d.color ? d.color : colors[d.id % colors.length]
        })
    }

    app.simulation.recorders.map(function(recorder, idx) {
        if (!recorder.node.model) return
        var recorderChart = recorder.node.chart || chart.fromOutputNode[recorder.node.model]
        recorder.chart = require(__dirname + '/chart/' + recorderChart)
        recorder.chart.init(idx)
        delete require.cache[require.resolve(__dirname + '/chart/' + recorderChart)]
    })

    app.chart.networkLayout.init()
    app.chart.networkLayout.toggle(app.config.app().chart.networkLayout)
    app.chart.events()
}

chart.events = function() {
    $('#autoscale').on('click', app.chart.update)

    window.addEventListener('resize', function() {
        app.resizing = true
        app.chart.init()
        app.chart.update()
        // app.chart.networkLayout.update()
        app.resizing = false
    });
}

module.exports = chart;
