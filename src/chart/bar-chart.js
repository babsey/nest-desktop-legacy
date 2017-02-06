"use strict"

"use strict"

const $ = require('jquery');
const d3Array = require('d3-array');
const d3Axis = require('d3-axis');
const d3Ease = require('d3-ease');
const d3Drag = require('d3-drag');
const d3Format = require('d3-format');
const d3Selection = require('d3-selection');
const d3Shape = require('d3-shape');
const d3Scale = require('d3-scale');
const d3Transition = require('d3-transition');
// const d3Zoom = require('d3-zoom');
const colorbrewer = require('colorbrewer');

window.dragging = false
window.zooming = false

var _chart = {
    margin: {
        top: 20,
        right: 40 + 330,
        bottom: 40,
        left: 50
    },
    y: 0
};

var margin = _chart.margin;
_chart.xScale = d3Scale.scaleLinear();
_chart.yScale = d3Scale.scaleLinear();

var colors = colorbrewer.Blues[5];
_chart.colorScale = d3Scale.scaleQuantile()
    .range(colors);

_chart.format = d3Format.format(".2f");

_chart.transition = d3Transition.transition()
    .ease(d3Ease.easeLinear)
    .duration(1);

var _xAxis, _yAxis;

var _data = {
    x: [],
    y: [],
    c: [],
};

_chart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return _chart
}

_chart.xAxis = function(xScale) {
    if (!arguments.length) return _xAxis;
    _xAxis = d3Axis.axisBottom(xScale);

    _chart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + -1. * +_chart.yScale.range()[1] + _chart.height + ")")
        .style('font-size', '14px')
        .call(_xAxis);

    return _chart
}

_chart.yAxis = function(yScale) {
    if (!arguments.length) return _yAxis;
    _yAxis = d3Axis.axisLeft(yScale).ticks(3);

    _chart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .attr("transform", "translate(0," + -1. * +_chart.yScale.range()[1] + ")")
        .call(_yAxis);

    return _chart
}

_chart.xLabel = function(label) {
    if (!document.getElementsByTagName("xlabel").length) {
        _chart.g.append("text")
            .attr("id", "xlabel")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", +_chart.g.attr('width') / 2)
            .attr("y", +_chart.g.attr('height') + 30)
            .text("Time (ms)");
    }

    _chart.g.select('#xlabel')
        .text(label);
    return _chart
}

_chart.yLabel = function(label) {
    if (!document.getElementsByTagName("ylabel").length) {
        _chart.g.append("text")
            .attr("id", "ylabel")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -1. * +_chart.yScale.range()[1])
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
    }

    _chart.g.select('#ylabel')
        .text(label);
    return _chart
}

function xDrag() {
    var xlim0 = _chart.xScale.domain();
    var xx = xlim0[1] - xlim0[0];
    var xs = _chart.xScale.range();
    var dx = d3Selection.event.dx * xx / (xs[1] - xs[0]);
    _chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
}

function yDrag() {
    var ylim0 = _chart.yScale.domain();
    var yy = ylim0[1] - ylim0[0];
    var ys = _chart.yScale.range();
    var dy = d3Selection.event.dy * yy / (ys[1] - ys[0]);
    if ((ylim0[0] - dy) < 0) return
    if (Math.floor(yy) < Math.floor(ylim0[0]) - dy) return
    _chart.yScale.domain([ylim0[0] - dy, ylim0[1] - dy])
}

_chart.drag = function() {
    _chart.g.select('#clip')
        .call(d3Drag.drag()
            .on("drag", function() {
                dragging = true
                $('#autoscale').prop('checked', false)
                xDrag()
                yDrag()
                _chart.update()
                dragging = false
            })
        );

    _chart.g.select('#xaxis')
        .call(d3Drag.drag()
            .on("drag", function() {
                dragging = true
                $('#autoscale').prop('checked', false)
                xDrag()
                _chart.update()
                dragging = false
            })
        );
    _chart.g.select('#yaxis')
        .call(d3Drag.drag()
            .on("drag", function() {
                dragging = true
                $('#autoscale').prop('checked', false)
                yDrag()
                _chart.update()
                dragging = false
            })
        );
    return _chart;
}

_chart.zoom = function() {
    // _chart.g.select('#_chart')
    //     .call(d3Zoom.zoom()
    //         .scaleExtent([1, 10])
    //         .on("start", function() {
    //             zooming = true
    //         })
    //         .on("zoom", function () {
    //               d3Selection.select('#_chart').attr("transform", "translate(" + d3Selection.event.translate + ")scale(" + d3Selection.event.scale + ")");
    //             }
    //             // _chart.update()
    //         })
    //         .on("end", function() {
    //             zooming = false
    //         })
    //     )
    // .on("dblclick.zoom", null);
    return _chart;
}

_chart.init = function(reference, height) {
    // d3Selection.select(reference).html("");

    var svg = d3Selection.select(reference),
        width = width || (+svg.attr("width") - margin.left - margin.right),
        height = height || (+svg.attr("height") - margin.top - margin.bottom);

    _chart.svg = svg;
    _chart.width = width;
    _chart.height = height;

    _chart.xScale.range([0, width])
    _chart.yScale.range([height, 0])

    var g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    _chart.g = g;

    var clip = g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    return _chart

}


var chart = _chart;

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

    if (running || dragging) {
        bars.attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return chart.yScale(d.length)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length));
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
                return chart.yScale(d.length)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length));
            });

    } else {
        bars.transition(chart.transition).attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return chart.yScale(d.length)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length));
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
                return chart.yScale(d.length)
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(d.length));
            });
    }

    bars.exit()
        .remove()

}

chart.update = update;
module.exports = chart.init;
