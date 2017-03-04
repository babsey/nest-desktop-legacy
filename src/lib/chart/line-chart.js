"use strict"

const d3 = require("d3");

var chart = {
    margin: {
        top: 10,
        right: 40,
        bottom: 40,
        left: 50
    },
    y: 0
};

var margin = chart.margin;
chart.xScale = d3.scaleLinear();
chart.yScale = d3.scaleLinear();
chart.format = d3.format(".2f");

var _xAxis, _yAxis;

var _data = {
    x: [],
    y: [],
    c: []
};

chart.line = d3.line();

chart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return chart
}

chart.init = function(reference, size) {
    var g = d3.select(reference),
        width = (size.width ? size.width : +g.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +g.attr("height")) - margin.top - margin.bottom;
    chart.width = width;
    chart.height = height;

    chart.xScale.range([0, width])
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

    app.simChart.xAxis(chart);
    app.simChart.yAxis(chart);
    app.simChart.xLabel(chart, 'Time (ms)');
    app.simChart.onDrag(chart);
    app.simChart.onZoom(chart);

    return chart

}

//
// Line chart
//

function _draw_line(classname) {

    var lines = chart.g.select('#clip')
        .selectAll('.' + classname)
        .data(chart.data().y);

    lines.attr("style", function(d, i) {
        return 'stroke:' + (app.selected_node ? chart.data().c[i] : '')
    })

    var transition = !(app.simulation.running || app.simChart.dragging || app.simChart.zooming || app.simChart.resizing || app.mouseover)
    if (transition) {
        lines.transition(app.simChart.transition)
            .attr('height', chart.height / chart.data().y.length)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (chart.data().y.length - i - 1) * chart.height / chart.data().y.length + ")"
            })
            .attr("style", function(d, i) {
                return 'stroke:' + (document.getElementById('color').checked ? chart.data().c[i] : '')
            })
            .attr("d", chart.line);

        lines.enter()
            .append("path")
            .attr('height', chart.height / chart.data().y.length)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (chart.data().y.length - i - 1) * chart.height / chart.data().y.length + ")"
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
                return 'stroke:' + (document.getElementById('color').checked ? chart.data().c[i] : '')
            })
            .transition(app.simChart.transition)
            .attr("d", chart.line);
    } else {
        lines.attr('height', chart.height / chart.data().y.length)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (chart.data().y.length - i - 1) * chart.height / chart.data().y.length + ")"
            })
            .attr("style", function(d, i) {
                return 'stroke:' + (document.getElementById('color').checked ? chart.data().c[i] : '')
            })
            .attr("d", chart.line)

        lines.enter()
            .append("path")
            .attr('height', chart.height / chart.data().y.length)
            .attr("transform", function(d, i) {
                return "translate(0," + -1 * (chart.data().y.length - i - 1) * chart.height / chart.data().y.length + ")"
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
                return 'stroke:' + (document.getElementById('color').checked ? chart.data().c[i] : '')
            })
            .attr("d", chart.line);
    }

    lines.exit()
        .remove();
}

function update() {
    chart.g.attr('height', chart.height / chart.data().y.length)
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.xScale.domain(app.simChart.xScale.domain())
    chart.yScale.domain(d3.extent([].concat.apply([], chart.data().y)))

    var transition = !(app.simulation.running || app.simChart.dragging || app.simChart.zooming || app.simChart.resizing || app.mouseover)
    app.simChart.axesUpdate(chart, transition)

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
