"use strict"

var d3Array = require('d3-array');
var d3Axis = require('d3-axis');
var d3Ease = require('d3-ease');
var d3Drag = require('d3-drag');
var d3Format = require('d3-format');
var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');
var d3Transition = require('d3-transition');
// var d3Zoom = require('d3-zoom');
var colorbrewer = require('colorbrewer');

var margin = {
        top: 20,
        right: 40,
        bottom: 30,
        left: 50
    },
    width = window.innerWidth - margin.left - margin.right - 10 - 324,
    height = window.innerHeight - margin.top - margin.bottom - 10;

var xScale = d3Scale.scaleLinear()
    .range([0, width]);

var yScale = d3Scale.scaleLinear()
    .range([height, 0]);

var colors = colorbrewer.Blues[5];
var colorScale = d3Scale.scaleQuantile()
    .range(colors);

var xAxis = d3Axis.axisBottom(xScale);
var yAxis = d3Axis.axisLeft(yScale);

var format = d3Format.format(".2f");

var transition = d3Transition.transition()
    .ease(d3Ease.easeLinear)
    .duration(1);

var _data = {
    x: [],
    y: [],
    c: [],
};

window.dragging = false
window.zooming = false

function data(d) {
    if (!arguments.length) return _data;
    _data = d;
    return chart
}

function ylabel(label) {
    d3Selection.select('#ylabel')
        .text(label);
    return chart
}

function xlabel(label) {
    d3Selection.select('#xlabel')
        .text(label);
    return chart
}

function drag() {
    d3Selection.select('#xaxis')
        .call(d3Drag.drag()
            .on("drag", function() {
                dragging = true

                $('#autoscale').prop('checked', false)
                var xlim0 = chart.xScale.domain();
                var xx = xlim0[1] - xlim0[0]
                var dx = d3Selection.event.dx * xx / 1000.;
                chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
                chart.update()
                dragging = false
            })
        );
    d3Selection.select('#yaxis')
        .call(d3Drag.drag()
            .on("drag", function() {
                dragging = true
                $('#autoscale').prop('checked', false)
                var ylim0 = chart.yScale.domain();
                var yy = ylim0[1] - ylim0[0]
                var dy = d3Selection.event.dy * yy / 1000.;
                chart.yScale.domain([ylim0[0] + dy, ylim0[1] + dy])
                chart.update()
                dragging = false
            })
        );
    return chart;
}

function zoom() {
    // d3Selection.select('#chart')
    //     .call(d3Zoom.zoom()
    //         .scaleExtent([1, 10])
    //         .on("start", function() {
    //             zooming = true
    //         })
    //         .on("zoom", function () {
    //               d3Selection.select('#chart').attr("transform", "translate(" + d3Selection.event.translate + ")scale(" + d3Selection.event.scale + ")");
    //             }
    //             // chart.update()
    //         })
    //         .on("end", function() {
    //             zooming = false
    //         })
    //     )
        // .on("dblclick.zoom", null);
    return chart;
}


function initChart(reference) {
    // d3Selection.select(reference).html("");

    var svg = d3Selection.select(reference).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip')
        .attr('transform', 'translate(1,-1)');

    svg.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .style('font-size', '14px')
        .call(xAxis);

    svg.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .call(yAxis);

    svg.append("text")
        .attr("id", "xlabel")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .text("Time (ms)");

    svg.append("text")
        .attr("id", "ylabel")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end");

    return chart
}

var chart = {
    margin: margin,
    width: width,
    height: height,
    format: format,
    transition: transition,
    data: data,
    xScale: xScale,
    yScale: yScale,
    colorScale: colorScale,
    xAxis: xAxis,
    yAxis: yAxis,
    xlabel: xlabel,
    ylabel: ylabel,
    drag: drag,
    zoom: zoom,
    initChart: initChart,
}

module.exports = chart
