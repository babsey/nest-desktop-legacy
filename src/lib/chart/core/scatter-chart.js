"use strict"

//
// Scatter chart
//

const d3 = require("d3");
var chart = {};

chart.update = function(data) {
    chart.yScale.range([chart.height - (+chart.g.attr('y')), chart.height - (+chart.g.attr('height')) - (+chart.g.attr('y'))])
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.xScale.domain(app.chart.xScale.domain())

    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    app.chart.axesUpdate(chart,transition)

    var dots = chart.g.select('#clip')
        .selectAll(".dot")
        .data(data.x);

    var color = app.config.app().get('chart.color');
    dots.attr("fill", function(d, i) {
            return color ? data.c[i] : ''
        })
        .attr("cx", function(d) {
            return chart.xScale(d);
        })
        .attr("cy", function(d, i) {
            return chart.yScale(data.y[i]);
        })

    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("fill", function(d, i) {
            return color ? data.c[i] : ''
        })
        .attr("cx", function(d) {
            return chart.xScale(d);
        })
        .attr("cy", function(d, i) {
            return chart.yScale(data.y[i]);
        }).merge(dots);

    dots.exit()
        .remove();
}


chart.init = function(reference, size) {
    var margin = {
            top: 10,
            right: 40,
            bottom: 40,
            left: 50
        };

    var svg = d3.select(reference),
        width = (size.width ? size.width : +svg.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +svg.attr("height")) - margin.top - margin.bottom;
    chart.svg = svg;
    chart.width = width;
    chart.height = height;

    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, width])
    chart.yScale = d3.scaleLinear();
    chart.yScale.range([height, 0])

    chart.g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) + ")");

    var clip = chart.g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    app.chart.xAxis(chart);
    app.chart.yAxis(chart);
    // app.chart.xLabel(chart, 'Time [ms]');
    app.chart.yLabel(chart, 'Neuron ID');
    app.chart.onDrag(chart);
    app.chart.onZoom(chart);
}

module.exports = chart;
