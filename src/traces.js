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

function traces(reference, npop) {

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
        .attr('id', 'line');

    return svg
}


var t = d3Transition.transition()
    .duration(250)
    .ease(d3Ease.easeLinear);

var color = d3Scale.schemeCategory20;

var line = d3Shape.line();
// .curve(d3Shape.curveBasis);

var bgline = d3Shape.line();
    // .curve(d3Shape.curveBasis);

function update(x, y, curtime, pop, ylabel) {

    xScale.domain([curtime - 1000., curtime]);
    yScale.domain(d3Array.extent(y, function(d, i) {
        return d
    })).nice(10);

    var npop = pop.length;
    var Y = pop.map(function() {
        return []
    });
    y.map(function(d, i) {
        Y[i % npop].push(d)
    });
    var X = x.filter(function(d, i) {
        return i % npop == 0
    });

    d3Selection.select('#ylabel')
        .text(ylabel);

    d3Selection.select('#xaxis')
        .transition(t)
        .call(xAxis);

    d3Selection.select('#yaxis')
        .transition(t)
        .call(yAxis);

    bgline.x(function(d, i) {
        return xScale(X[i]);
    }).y(function(d) {
        return yScale(d);
    });

    var bgtraces = d3Selection
        .select('#line')
        .selectAll(".bgline")
        .data(Y);

    bgtraces
        .transition(t)
        .attr("d", bgline);

    bgtraces.enter()
        .append("path")
        .attr("class", "bgline")
        .on('mouseover', function(d, i) {
            d3Selection.selectAll('#line')
                .classed('active', true);
            d3Selection.select('#line_' + i)
                .classed('active', true);
        })
        .on('mouseout', function(d, i) {
            d3Selection.selectAll('#line')
                .classed('active', false)
            d3Selection.selectAll('.line')
                .classed('active', false);
        })
        .transition(t)
        .attr("d", bgline);

    bgtraces.exit().remove()

    var traces = d3Selection
        .select('#line')
        .selectAll(".line")
        .data(Y);

    line.x(function(d, i) {
        return xScale(X[i]);
    }).y(function(d) {
        return yScale(d);
    });

    traces
        .transition(t)
        .attr("d", line);

    traces.enter()
        .append("path")
        .attr("id", function(d, i) {
            return 'line_' + i
        })
        .attr("class", "line")
        .on('mouseover', function(d, i) {
            d3Selection.selectAll('#line')
                .classed('active', true);
            d3Selection.select(this)
                .classed('active', true);
        })
        .on('mouseout', function(d, i) {
            d3Selection.selectAll('#line')
                .classed('active', false)
            d3Selection.selectAll('.line')
                .classed('active', false);
        })
        .transition(t)
        .attr("d", line);

    traces.exit().remove()
}


module.exports = {
    traces: traces,
    update: update
}
