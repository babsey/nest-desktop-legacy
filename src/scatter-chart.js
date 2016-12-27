"use strict"

var d3Array = require('d3-array');
var d3Axis = require('d3-axis');
var d3Ease = require('d3-ease');
var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');
var d3Transition = require('d3-transition');

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var xScale = d3Scale.scaleLinear()
    .range([0, width]);

var yScale = d3Scale.scaleLinear()
    .range([height, 0]);

var xAxis = d3Axis.axisBottom(xScale);
var yAxis = d3Axis.axisLeft(yScale);

var t = d3Transition.transition()
    .duration(250)
    .ease(d3Ease.easeLinear);

var _data = {
    x: [],
    y: [],
};

function data(d) {
    if (!arguments.length) return _data;
    _data = d;
    xlim(d3Array.extent(_data.x));
    ylim(d3Array.extent([].concat.apply([], _data.y)));
    return chart;
}

function xlim(x) {
    if (!arguments.length) return d3Array.extent(_data.x);
    xScale.domain(x);
    return chart
}

function ylim(y) {
    if (!arguments.length) return d3Array.extent([].concat.apply([], _data.y));
    yScale.domain(y);
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

function update() {

    d3Selection.select('#xaxis')
        .transition(t)
        .call(xAxis);

    d3Selection.select('#yaxis')
        .transition(t)
        .call(yAxis);

    var dots = d3Selection
        .select('#scatter')
        .selectAll(".dot")
        .data(_data.x);

    dots.attr("cx", function(d) {
            return xScale(d);
        })
        .attr("cy", function(d, i) {
            return yScale(_data.y[i]);
        })

    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function(d) {
            return xScale(d);
        })
        .attr("cy", function(d, i) {
            return yScale(_data.y[i]);
        });

    dots.exit()
        .remove();

    return chart;
}

function scatterChart(reference) {
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
        .attr("y", height + margin.bottom - 5);

    svg.append("text")
        .attr("id", "ylabel")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end");

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'scatter');

    return chart
}

var chart = {
    data: data,
    xlim: xlim,
    ylim: ylim,
    xlabel: xlabel,
    ylabel: ylabel,
    update: update,
}

module.exports = scatterChart
