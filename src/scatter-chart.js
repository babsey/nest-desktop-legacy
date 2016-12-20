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
    .duration(750)
    .ease(d3Ease.easeLinear);

var data;

function _update() {
    var dots = d3Selection.select('#chart-area')
        .selectAll(".dot")
        .data(data.x);

    dots.attr("cx", function(d) {
            return xScale(d);
        })
        .attr("cy", function(d, i) {
            return yScale(data.y[i]);
        })

    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 1.)
        .attr("cx", function(d) {
            return xScale(d);
        })
        .attr("cy", function(d, i) {
            return yScale(data.y[i]);
        });

    dots.exit()
        .remove();
}

function update(x, y) {
    data = {
        x: x,
        y: y
    }

    xlim(d3Array.extent(x));
    ylim(d3Array.extent(y));
    _update()
    return chart
}

function xlim(xlim) {
    xScale.domain(xlim);
    d3Selection.select('#xaxis')
        .transition(t)
        .call(xAxis);
    _update()
    return chart
}

function ylim(ylim) {
    yScale.domain(ylim);
    d3Selection.select('#yaxis')
        .transition(t)
        .call(yAxis);
    _update()
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

function scatterChart(reference) {
    d3Selection.select(reference).html("");

    var svg = d3Selection.select(reference).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('id', "chart-area");

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

    return chart
}

var chart = {
    update: update,
    xlim: xlim,
    ylim: ylim,
    xlabel: xlabel,
    ylabel: ylabel
}

module.exports = scatterChart
