"use strict"

var chart = require('./chart');

function update() {
    chart.yScale.range([chart.height - (+chart.g.attr('y')), chart.height - (+chart.g.attr('height')) - (+chart.g.attr('y'))])
    chart.xScale.range([0, +chart.g.attr('width')])

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

    var dots = chart.g.select('#clip')
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
module.exports = chart.init;
