"use strict"

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

var simChart = {
    trace: require(__dirname + '/simChart/trace'),
    rasterPlot: require(__dirname + '/simChart/raster-plot'),
    heatmap: require(__dirname + '/simChart/heatmap'),
    networkLayout: require(__dirname + '/simChart/network-layout')
};

simChart.fromModel = {
    'voltmeter': 'trace',
    'multimeter': 'trace',
    'spike_detector': 'rasterPlot',
}


simChart.transition = d3.transition()
    .ease(d3.easeLinear)
    .duration(1);

simChart.xAxis = function(chart) {
    chart.xAxis = d3.axisBottom(chart.xScale);
    chart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + chart.height + ")")
        .style('font-size', '14px')
        .call(chart.xAxis);
}

simChart.yAxis = function(chart) {
    chart.yAxis = d3.axisLeft(chart.yScale).ticks(3);
    chart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .attr("transform", "translate(0,0)")
        .call(chart.yAxis);
}

simChart.xLabel = function(chart, label) {
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

simChart.yLabel = function(chart, label) {
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

simChart.drag = function() {
    $('#autoscale').prop('checked', false)
    var xlim0 = app.simChart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = app.simChart.xScale.range();
    var dx = d3.event.dx * xx / (xs[1] - xs[0]);
    app.simChart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
    app.simChart.update()
}

simChart.onDrag = function(chart) {
    chart.drag = d3.drag()
        .on("start", function() {
            simChart.dragging = true
        })
        .on("drag", function() {
            simChart.drag()
        })
        .on("end", function() {
            simChart.dragging = false
        })
    chart.g.select('#clip')
        .call(chart.drag);
}

simChart.zoom = function() {
    $('#autoscale').prop('checked', false)
    var xlim0 = app.simChart.xScale.domain();
    // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
    var xx = (xlim0[0] + xlim0[1]) / 2;
    var k = d3.event.transform.k;
    app.simChart.xScale.domain([xx - xx / k, xx + xx / k])
    app.simChart.update()
}

simChart.onZoom = function(chart) {
    chart.zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", function() {
            simChart.zooming = true
        })
        .on("zoom", function() {
            simChart.zoom()
        })
        .on("end", function() {
            simChart.zooming = false
        })
    chart.g.select('#clip')
        .call(chart.zoom);
}

simChart.axesUpdate = function(chart, transition) {
    if (transition) {
        chart.g.select('#xaxis')
            .transition(simChart.transition)
            .call(chart.xAxis);
        chart.g.select('#yaxis')
            .transition(simChart.transition)
            .call(chart.yAxis);
    } else {
        chart.g.select('#xaxis')
            .call(chart.xAxis);
        chart.g.select('#yaxis')
            .call(chart.yAxis);
    }
}

simChart.init = function() {
    $('#color').prop('checked', app.config.app().get('simulation.chart.color'))

    simChart.zooming = false;
    simChart.dragging = false;

    // mouse event vars
    simChart.mousedown_link = null;
    simChart.mousedown_node = null;
    simChart.mouseup_node = null;

    simChart.margin = {
        top: 50,
        right: 350,
        bottom: 0,
        left: 0
    }
    simChart.width = window.innerWidth - simChart.margin.left - simChart.margin.right
    simChart.height = window.innerHeight - simChart.margin.top - simChart.margin.bottom

    $('#chart').attr('width', window.innerWidth).attr('height', simChart.height)
    $('#dataChart').attr('width', simChart.width)
        .attr('height', simChart.height)
    $('#layout').attr('width', simChart.width)
        .attr('height', simChart.height)
    $('#dataChart').empty()
    $('#layout').empty()

    if (simChart.xScale) {
        var xScaleDomain = simChart.xScale.domain()
    }
    simChart.xScale = d3.scaleLinear();
    simChart.xScale.range([simChart.margin.left, (+window.innerWidth - simChart.margin.right)])
    if (xScaleDomain) {
        simChart.xScale.domain(xScaleDomain)
    }

    var colors = d3.schemeCategory10;
    simChart.colors = app.data.nodes.map(function(d) {
        return d.color ? d.color : colors[d.id % colors.length]
    })

    var outputs = app.data.nodes.filter(function(node) {
        return node.type == 'output'
    })

    outputs.map(function(output, idx) {
        simChart[output.chart || simChart.fromModel[output.model]].init(output, outputs.length, idx)
    })

    if (app.data.layout) {
        app.simChart.networkLayout.init('#layout')
        if (app.config.app().get('simulation.chart.layout')) {
            $('#layout').show()
            $('#layout-button').addClass('active')
        }
    }

    app.events.chart()
}

simChart.update = function() {
    if ($('#autoscale').prop('checked')) {
        simChart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
    }

    var outputs = app.data.nodes.filter(function(node) {
        return node.type == 'output'
    })

    outputs.map(function(output, idx) {
        simChart[output.chart || simChart.fromModel[output.model]].update(output)
    })

    $('#simulation-add').attr('disabled', false)
    $('#simulation-resume').attr('disabled', false)
}

module.exports = simChart;
