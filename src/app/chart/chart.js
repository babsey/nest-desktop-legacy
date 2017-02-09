"use strict"

const colorbrewer = require('colorbrewer');

window.dragging = false
window.zooming = false

var _chart = {
    margin: {
        top: 30,
        right: 40 + 330,
        bottom: 40,
        left: 50
    },
    y: 0
};

var margin = _chart.margin;
_chart.xScale = d3.scaleLinear();
_chart.yScale = d3.scaleLinear();

var colors = colorbrewer.Blues[5];
_chart.colorScale = d3.scaleQuantile()
    .range(colors);

_chart.format = d3.format(".2f");

_chart.transition = d3.transition()
    .ease(d3.easeLinear)
    .duration(1);

var _xAxis, _yAxis;

var _data = {
    x: [],
    y: [],
    c: [],
};

_chart.line = d3.line();

_chart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return _chart
}

_chart.xAxis = function(xScale) {
    if (!arguments.length) return _xAxis;
    _xAxis = d3.axisBottom(xScale);

    _chart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + _chart.g.attr('height') + ")")
        .style('font-size', '14px')
        .call(_xAxis);

    return _chart
}

_chart.yAxis = function(yScale) {
    if (!arguments.length) return _yAxis;
    _yAxis = d3.axisLeft(yScale).ticks(3);

    _chart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .attr("transform", "translate(0," + (+_chart.g.attr('height') - window.innerHeight + _chart.margin.bottom + _chart.margin.top) + ")")
        .call(_yAxis);

    return _chart
}

_chart.xLabel = function(label) {
    if (!document.getElementsByTagName("xlabel").length) {
        _chart.g.append("text")
            .attr("id", "xlabel")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", +_chart.g.attr('width') / 2)
            .attr("y", +_chart.g.attr('height') + 30)
            .text("Time (ms)");
    }

    _chart.g.select('#xlabel')
        .text(label);
    return _chart
}

_chart.yLabel = function(label) {
    if (!document.getElementsByTagName("ylabel").length) {
        _chart.g.append("text")
            .attr("id", "ylabel")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -1. * +_chart.yScale.range()[1])
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
    }

    _chart.g.select('#ylabel')
        .text(label);
    return _chart
}

_chart.onDrag = function(drag) {
    _chart.drag = d3.drag()
        .on("start", function() {
            dragging = true
        })
        .on("drag", function() {
            drag()
        })
        .on("end", function() {
            dragging = false
        })
    _chart.g.select('#clip')
        .call(_chart.drag);
    return _chart;
}

_chart.onZoom = function(zoom) {
    _chart.zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", function() {
            zooming = true
        })
        .on("zoom", function() {
            zoom()
        })
        .on("end", function() {
            zooming = false
        })
    _chart.g.select('#clip')
        .call(_chart.zoom);
    return _chart;
}

_chart.init = function(reference) {
    var svg = d3.select(reference),
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
    _chart.svg = svg;
    _chart.width = width;
    _chart.height = height;

    _chart.xScale.range([0, width])
    _chart.yScale.range([height, 0])

    var g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    _chart.g = g;

    var clip = g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    return _chart

}

module.exports = _chart
