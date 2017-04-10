"use strict"

//
// Line chart
//

const d3 = require("d3");

var chart = {};

function _draw_line(data, classname) {

    var lines = chart.g.select('#clip')
        .selectAll('.' + classname)
        .data(data.y);

    lines.attr("style", function(d, i) {
        return 'stroke:' + (app.selected_node ? data.c[i] : '')
    })

    var color = app.config.app().get('chart.color.show');
    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    if (transition) {
        lines.transition(app.chart.transition)
            .attr('height', chart.height / data.n)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (data.n - (i%data.n) - 1) * chart.height / data.n + ")"
            })
            .attr("style", function(d, i) {
                return 'stroke:' + (color ? data.c[i] : '')
            })
            .attr("d", chart.line);

        lines.enter()
            .append("path")
            .attr('height', chart.height / data.n)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (data.n - (i%data.n) - 1) * chart.height / data.n + ")"
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
            .attr("style", function(d, i) {
                return 'stroke:' + (color ? data.c[i] : '')
            })
            .transition(app.chart.transition)
            .attr("d", function(d) { return chart.line(d)});
    } else {
        lines.attr('height', chart.height / data.n)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (data.n - (i%data.n) - 1) * chart.height / data.n + ")"
            })
            .attr("style", function(d, i) {
                return 'stroke:' + (color ? data.c[i] : '')
            })
            .attr("d", chart.line)

        lines.enter()
            .append("path")
            .attr('height', chart.height / data.n)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (data.n - (i%data.n) - 1) * chart.height / data.n + ")"
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
            .attr("style", function(d, i) {
                return 'stroke:' + (color ? data.c[i] : '')
            })
            .attr("d", chart.line);
    }

    lines.exit()
        .remove();
}

chart.update = function(data) {
    chart.g.attr('height', chart.height / data.n)
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.xScale.domain(app.chart.xScale.domain())
    chart.yScale.domain(d3.extent([].concat.apply([], data.y)))

    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    app.chart.axesUpdate(chart, transition)

    chart.line.x(function(d, i) {
        return chart.xScale(data.x[i]);
    }).y(function(d) {
        return chart.yScale(d);
    });

    _draw_line(data, 'aline')
    _draw_line(data, 'bline')
}

chart.init = function(reference, size) {

    var margin = {
        top: 10,
        right: 40,
        bottom: 40,
        left: 50
    };

    var g = d3.select(reference),
        width = (size.width ? size.width : +g.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +g.attr("height")) - margin.top - margin.bottom;
    chart.width = width;
    chart.height = height;

    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, width])
    chart.yScale = d3.scaleLinear();
    chart.yScale.range([height, 0])

    chart.g = g.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) + ")");

    var clip = chart.g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    app.chart.xAxis(chart);
    app.chart.yAxis(chart);
    app.chart.xLabel(chart, 'Time (ms)');
    app.chart.onDrag(chart);
    app.chart.onZoom(chart);

    chart.line = d3.line();
}

module.exports = chart
