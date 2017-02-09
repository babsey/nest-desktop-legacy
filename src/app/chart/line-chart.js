"use strict"

const chart = require('./chart');

function _draw_line(classname) {

    var lines = chart.g.select('#clip')
        .selectAll('.' + classname)
        .data(chart.data().y);

    if (running || dragging || zooming) {
        lines.attr('height', chart.height / chart.data().y.length)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * i * chart.height / chart.data().y.length + ")"
            })
            .attr("d", chart.line);
    } else {
        lines.transition(chart.transition)
            .attr('height', chart.height / chart.data().y.length)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * i * chart.height / chart.data().y.length + ")"
            })
            .attr("d", chart.line)
    }

    lines.enter()
        .append("path")
        .attr('height', chart.height / chart.data().y.length)
        .attr("transform", function(d, i) {
            return "translate(0," + -1 * i * chart.height / chart.data().y.length + ")"
        })
        .attr("class", function(d, i) {
            return classname + ' line_' + i
        })
        .on('mouseover', function(d, i) {
            chart.g.selectAll('#clip')
                .classed('active', true);
            chart.g.selectAll('.aline.line_' + i)
                .classed('active', true);
        })
        .on('mouseout', function(d, i) {
            chart.g.selectAll('#clip')
                .classed('active', false)
            chart.g.selectAll('#clip path')
                .classed('active', false);
        })
        .attr("style", function() {
            return 'zscore:' + (classname == 'aline' ? 1 : -1000)
        })
        .transition(chart.transition)
        .attr("d", chart.line);

    lines.exit()
        .remove();
}

function update() {
    chart.g.attr('height', chart.height / chart.data().y.length)
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.range([0, +chart.g.attr('width')])

    if (running || dragging || zooming) {
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

    chart.line.x(function(d, i) {
        return chart.xScale(chart.data().x[i]);
    }).y(function(d) {
        return chart.yScale(d);
    });

    _draw_line('aline')
    _draw_line('bline')
}

chart.update = update;
module.exports = chart.init
