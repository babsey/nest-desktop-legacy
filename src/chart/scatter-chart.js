"use strict"

var d3Selection = require('d3-selection');
var chart = require('./chart');

function update() {

    if (running || dragging) {
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

    var dots = d3Selection
        .select('#clip')
        .selectAll(".dot")
        .data(chart.data().x);

    dots.attr("cx", function(d) {
            return chart.xScale(d);
        })
        .attr("cy", function(d, i) {
            return chart.yScale(chart.data().y[i]);
        })

    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("cx", function(d) {
            return chart.xScale(d);
        })
        .attr("cy", function(d, i) {
            return chart.yScale(chart.data().y[i]);
        });

    dots.exit()
        .remove();
}

chart.update = update;
module.exports = chart.initChart;
