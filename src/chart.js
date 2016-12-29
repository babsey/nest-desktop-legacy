"use strict"

var d3Array = require('d3-array');
var d3Axis = require('d3-axis');
var d3Ease = require('d3-ease');
var d3Format = require('d3-format');
var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');
var d3Transition = require('d3-transition');
var colorbrewer = require('colorbrewer');

var margin = {
        top: 20,
        right: 40,
        bottom: 30,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

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
    .duration(250)
    .ease(d3Ease.easeLinear);

var _data = {
    x: [],
    y: [],
    c: [],
};

function data(d) {
    if (!arguments.length) return _data;
    _data = d;
    return chart
}

function xlim(x) {
    if (!arguments.length) return d3Array.extent(_data.x);
    xScale.domain(x);
    return chart
}

function ylim(y) {
    if (!arguments.length) return d3Array.extent(_data.y);
    yScale.domain(y);
    return chart
}

function clim(c) {
    if (!arguments.length) return _data.c;
    colorScale.domain(c);
    return chart
}

function cmap(c) {
    if (!arguments.length) return colors;
    colorScale.range(c)
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

function initChart(reference) {
    d3Selection.select(reference).html("");

    var svg = d3Selection.select(reference).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .call(yAxis);

    svg.append("text")
        .attr("id", "xlabel")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("Time (ms)");

    svg.append("text")
        .attr("id", "ylabel")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end");

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip')
        .attr('transform', 'translate(1,-1)');

    return chart
}

var chart = {
    margin: margin,
    width: width,
    height: height,
    format: format,
    transition : transition,
    data: data,
    cmap: cmap,
    xScale: xScale,
    yScale: yScale,
    colorScale: colorScale,
    xAxis: xAxis,
    yAxis: yAxis,
    xlim: xlim,
    ylim: ylim,
    clim: clim,
    xlabel: xlabel,
    ylabel: ylabel,
    initChart: initChart,
}

module.exports = chart
