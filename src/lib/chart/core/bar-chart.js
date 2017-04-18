"use strict"

//
// Bar-chart
//

const d3 = require("d3");

var chart = {};

chart.yVal = function(d, idx) {
    idx = idx || 'total'
    if (typeof idx == 'number' || idx == 'total') {
        var y = d[idx]
    } else {
        var y = idx.map(function(i) {
            return d[i]
        }).reduce(function(acc, val) {
            return acc + val
        })
    }
    return y // chart.npop() * 1000. // chart.binwidth()
}

chart.update = function(recorder) {
    if (!recorder.data) return
    var data = recorder.data.bars;
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.yScale.range([+chart.g.attr('height'), 0])

    if (app.selected_node && app.selected_node.element_type == 'neuron' && recorder.sources.indexOf(app.selected_node.id) != -1) {
        var nidx = app.selected_node.id;
        var idx = app.selected_node.ids.map(function(d) {
            return recorder.senders.indexOf(d);
        })
    } else {
        var nidx = null;
        var idx = 'total';
    }

    chart.xScale.domain(app.chart.xScale.domain())
    chart.yScale.domain([0, d3.max(data, function(d) {
        return chart.yVal(d, idx.length == 1 ? idx[0]: idx)
    })])

    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    app.chart.axesUpdate(chart, transition)

    var bars = chart.g.select('#clip')
        .selectAll(".bar")
        .data(data);
    chart.bars = bars;

    var colors = app.chart.colors()
    var cidx = (recorder.sources.length == 1 ? recorder.sources[0] : nidx)
    var color = app.config.app().chart.color ? colors[cidx || (recorder.node.id % colors.length)] : ''
    if (transition) {
        bars
            .attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .transition(app.chart.transition)
            .attr("y", function(d) {
                return chart.yScale(chart.yVal(d, idx))
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx)));
            })
            .style("fill", color);

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
            .transition(app.chart.transition)
            .attr("y", function(d) {
                return chart.yScale(chart.yVal(d, idx))
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx)));
            })
            .style("fill", color);
    } else {
        bars
            .attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return chart.yScale(chart.yVal(d, idx))
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx)));
            })
            .style("fill", color);

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
            .attr("y", function(d) {
                return chart.yScale(chart.yVal(d, idx))
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx)));
            })
            .style("fill", color);
    }

    bars.exit()
        .remove()

}

chart.init = function(reference, size) {

    var margin = {
        top: 10,
        right: 40,
        bottom: 40,
        left: 50
    }

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
    app.chart.xLabel(chart, 'Time [ms]');
    app.chart.yLabel(chart, 'Spike count');
    app.chart.onDrag(chart);
    app.chart.onZoom(chart);
}

module.exports = chart;
