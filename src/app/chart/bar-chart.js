"use strict"

const chart = require('./chart1');

function update() {
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.yScale.range([+chart.g.attr('height'), 0])

    if (running || dragging) {
        chart.g.select('#xaxis')
            .call(chart.xAxis());
        chart.g.select('#yaxis')
            .call(chart.yAxis());
    } else {
        chart.g.select('#xaxis')
            .transition(chart.transition)
            .call(chart.xAxis());
        chart.g.select('#yaxis')
            .transition(chart.transition)
            .call(chart.yAxis());
    }

    var bins = chart.data();
    var bars = chart.g.select('#clip')
        .selectAll(".bar")
        .data(bins);

    var factor = 1. / chart.binwidth() / chart.popsize()

    if (running || dragging) {
        bars.attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return chart.yScale(d.length * factor)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length * factor));
            });

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return chart.yScale(d.length * factor)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length * factor));
            });

    } else {
        bars.transition(chart.transition).attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return chart.yScale(d.length * factor)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length * factor));
            });

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr('y', chart.g.attr('height'))
            .transition(chart.transition)
            .attr("y", function(d) {
                return chart.yScale(d.length * factor)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length * factor));
            });
    }

    bars.exit()
        .remove()

}

chart.update = update;
module.exports = chart.init;
