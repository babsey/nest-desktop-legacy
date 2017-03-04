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

var _data = [];

chart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return chart
}

var _npop = 1;
chart.npop = function(d) {
    if (!arguments.length) return _npop;
    _npop = d;
    return chart
}

var _sources = [];
chart.sources = function(d) {
    if (!arguments.length) return _sources;
    _sources = d;
    return chart
}

var _nbins = 1.;
chart.nbins = function(d) {
    if (!arguments.length) return _nbins;
    _nbins = d;
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
    app.simChart.xLabel(chart, 'Time [ms]');
    app.simChart.yLabel(chart, 'Spike count');
    app.simChart.onDrag(chart);
    app.simChart.onZoom(chart);

    return chart
}

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

//
// Bar-chart
//

chart.update = function() {
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.yScale.range([+chart.g.attr('height'), 0])

    if (app.selected_node && app.selected_node.type == 'neuron') {
        var nidx = app.selected_node.id;
        var idx = app.selected_node.ids.map(function(d) {
            return chart.sources().indexOf(d)
        });
    } else {
        var nidx = null;
        var idx = 'total';
    }

    chart.xScale.domain(app.simChart.xScale.domain())
    chart.yScale.domain([0, d3.max(chart.data(), function(d) {
        return chart.yVal(d, 'total')
    })])

    var transition = !(app.simulation.running || app.simChart.dragging || app.simChart.zooming || app.simChart.resizing || app.mouseover)
    app.simChart.axesUpdate(chart, transition)

    var bars = chart.g.select('#clip')
        .selectAll(".bar")
        .data(chart.data());
    chart.bars = bars;

    var colors = app.simChart.colors
    if (transition) {
        bars
            .attr("x", function(d) {
                return chart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return chart.xScale(d.x1) - chart.xScale(d.x0)
            })
            .transition(app.simChart.transition)
            .attr("y", function(d) {
                return chart.yScale(chart.yVal(d, idx))
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx)));
            })
            .style("fill", nidx ? colors[nidx] : '');

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
            .transition(app.simChart.transition)
            .attr("y", function(d) {
                return chart.yScale(chart.yVal(d, idx))
            })
            .attr("height", function(d) {
                return Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx)));
            })
            .style("fill", nidx ? colors[nidx] : '');
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
            .style("fill", nidx ? colors[nidx] : '');

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
            .style("fill", nidx ? colors[nidx] : '');
    }

    bars.exit()
        .remove()

}

module.exports = chart.init;
