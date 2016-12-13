"use strict"

var $ = require("jquery");

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

var line = d3Shape.line()
    .x(function(d) {
        return xScale(d);
    });


var svg;

function trace(reference) {

    $(reference).empty()

    svg = d3Selection.select(reference).append("svg")
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
        .attr("text-anchor", "end")
        .text("Membrane potential (mV)");

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .attr("class", "line");

    return svg
}

var t = d3Transition.transition()
    .duration(250)
    .ease(d3Ease.easeLinear);

function update(x, y, curtime, ylabel) {

    xScale.domain([curtime - 1000., curtime]);
    yScale.domain(d3Array.extent(x, function(d, i) {
        return y[i]
    })).nice(10);

    d3Selection.select('#ylabel')
        .text(ylabel);

    d3Selection.select('#xaxis')
        .transition(t)
        .call(xAxis);

    d3Selection.select('#yaxis')
        .transition(t)
        .call(yAxis);

    line.y(function(d, i) {
        return yScale(y[i]);
    })

    svg.selectAll('.line')
        .datum(x)
        .transition(t)
        .attr('d', line);

}


module.exports = {
    trace: trace,
    update: update
}
