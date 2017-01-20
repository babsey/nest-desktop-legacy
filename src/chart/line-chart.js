"use strict"

var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var chart = require('./chart');

var line = d3Shape.line();

function _draw_line(classname) {

    var lines = d3Selection
        .select('#clip')
        .selectAll("." + classname)
        .data(chart.data().y);

    if (running || dragging || zooming) {
        lines.attr("d", line);
    } else {
        lines.transition(chart.transition).attr("d", line)
    }

    lines.enter()
        .append("path")
        .attr("class", function(d, i) {
            return classname + ' line_' + i
        })
        .on('mouseover', function(d, i) {
            d3Selection.selectAll('#clip')
                .classed('active', true);
            d3Selection.selectAll('.aline.line_' + i)
                .classed('active', true);
        })
        .on('mouseout', function(d, i) {
            d3Selection.selectAll('#clip')
                .classed('active', false)
            d3Selection.selectAll('#clip path')
                .classed('active', false);
        })
        .attr("style", function() {
            return 'zscore:' + (classname == 'aline' ? 1 : -1000)
        })
        .transition(chart.transition)
        .attr("d", line);

    lines.exit()
        .remove();
}

function update() {

    if (running || dragging || zooming) {
        d3Selection.select('#xaxis')
            .call(chart.xAxis);
        d3Selection.select('#yaxis')
            .call(chart.yAxis);
    } else {
        d3Selection.select('#xaxis')
            .transition(chart.transition)
            .call(chart.xAxis);
        d3Selection.select('#yaxis')
            .transition(chart.transition)
            .call(chart.yAxis);
    }

    line.x(function(d, i) {
        return chart.xScale(chart.data().x[i]);
    }).y(function(d) {
        return chart.yScale(d);
    });

    _draw_line('aline')
    _draw_line('bline')
}

chart.update = update;
module.exports = chart.initChart
