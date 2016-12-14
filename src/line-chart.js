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

var aline = d3Shape.line();
var bline = d3Shape.line();

var data;

function _update(line, classname) {

    line.x(function(d, i) {
        return xScale(data.x[i]);
    }).y(function(d) {
        return yScale(d);
    });

    var lines = d3Selection
        .select('#line')
        .selectAll("."+ classname)
        .data(data.y);

    lines
        .transition(t)
        .attr("d", line);

    lines.enter()
        .append("path")
        .attr("class", function(d, i) {
            return classname +' line_'+ i
        })
        .on('mouseover', function(d, i) {
            d3Selection.selectAll('#line')
                .classed('active', true);
            d3Selection.selectAll('.aline.line_' + i)
                .classed('active', true);
        })
        .on('mouseout', function(d, i) {
            d3Selection.selectAll('#line')
                .classed('active', false)
            d3Selection.selectAll('.aline')
                .classed('active', false);
        })
        .transition(t)
        .attr("d", line);

    lines.exit().remove()

}

function update(x, y) {
    data = {
        x: x,
        y: y
    };

    xlim(d3Array.extent(x));
    ylim(d3Array.extent([].concat.apply([], y)));
    _update(bline,'bline')
    _update(aline,'aline')
    return chart
}

function xlim(xlim) {
    xScale.domain(xlim);
    d3Selection.select('#xaxis')
        .transition(t)
        .call(xAxis);
    return chart
}

function ylim(ylim) {
    yScale.domain(ylim);
    d3Selection.select('#yaxis')
        .transition(t)
        .call(yAxis);
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

function lineChart(reference) {
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
        .attr('id', 'line');

    return chart
}

var chart = {
    update: update,
    xlim: xlim,
    ylim: ylim,
    xlabel: xlabel,
    ylabel: ylabel,
}

module.exports = lineChart
