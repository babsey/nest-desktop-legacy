"use strict"

const d3 = require("d3");

var chart = {
    margin: {
        top: 10,
        right: 40,
        bottom: 40,
        left: 50
    },
    y: 0
};

var margin = chart.margin;
chart.xScale = d3.scaleLinear();
chart.yScale = d3.scaleLinear();
chart.format = d3.format(".2f");

var _xAxis, _yAxis;

var _data = {
    x: [],
    y: [],
    c: []
};

chart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return chart
}

chart.init = function(reference, size) {
    var svg = d3.select(reference),
        width = (size.width ? size.width : +svg.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +svg.attr("height")) - margin.top - margin.bottom;
    chart.svg = svg;
    chart.width = width;
    chart.height = height;

    chart.xScale.range([0, width])
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

    app.simChart.xAxis(chart);
    app.simChart.yAxis(chart);
    // app.simChart.xLabel(chart, 'Time [ms]');
    app.simChart.yLabel(chart, 'Neuron ID');
    app.simChart.onDrag(chart);
    app.simChart.onZoom(chart);

    return chart
}

//
// Scatter chart
//

function update() {
    chart.yScale.range([chart.height - (+chart.g.attr('y')), chart.height - (+chart.g.attr('height')) - (+chart.g.attr('y'))])
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.xScale.domain(app.simChart.xScale.domain())

    var transition = !(app.simulation.running || app.simChart.dragging || app.simChart.zooming || app.simChart.resizing || app.mouseover)
    app.simChart.axesUpdate(chart,transition)

    var dots = chart.g.select('#clip')
        .selectAll(".dot")
        .data(chart.data().x);

    dots.attr("fill", function(d, i) {
            return document.getElementById('color').checked ? chart.data().c[i] : ''
        })
        .attr("cx", function(d) {
            return chart.xScale(d);
        })
        .attr("cy", function(d, i) {
            return chart.yScale(chart.data().y[i]);
        })

    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("fill", function(d, i) {
            return document.getElementById('color').checked ? chart.data().c[i] : ''
        })
        .attr("cx", function(d) {
            return chart.xScale(d);
        })
        .attr("cy", function(d, i) {
            return chart.yScale(chart.data().y[i]);
        }).merge(dots);

    dots.exit()
        .remove();
}

chart.update = update;
module.exports = chart.init;
