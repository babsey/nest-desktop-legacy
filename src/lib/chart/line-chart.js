"use strict"

const d3 = require("d3");

var chart = {
    margin: {
        top: 30,
        right: 40 + 330,
        bottom: 40,
        left: 50
    },
    y: 0
};

var margin = chart.margin;
chart.xScale = d3.scaleLinear();
chart.yScale = d3.scaleLinear();
chart.format = d3.format(".2f");

chart.transition = d3.transition()
    .ease(d3.easeLinear)
    .duration(1);

var _xAxis, _yAxis;

var _data = {
    x: [],
    y: [],
};

chart.line = d3.line();

chart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return chart
}

chart.xAxis = function(xScale) {
    if (!arguments.length) return _xAxis;
    _xAxis = d3.axisBottom(xScale);

    chart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + chart.g.attr('height') + ")")
        .style('font-size', '14px')
        .call(_xAxis);

    return chart
}

chart.yAxis = function(yScale) {
    if (!arguments.length) return _yAxis;
    _yAxis = d3.axisLeft(yScale).ticks(3);

    chart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .attr("transform", "translate(0," + (+chart.g.attr('height') - window.innerHeight + chart.margin.bottom + chart.margin.top) + ")")
        .call(_yAxis);

    return chart
}

chart.xLabel = function(label) {
    if (!document.getElementsByTagName("xlabel").length) {
        chart.g.append("text")
            .attr("id", "xlabel")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", +chart.g.attr('width') / 2)
            .attr("y", +chart.g.attr('height') + 30)
            .text("Time (ms)");
    }

    chart.g.select('#xlabel')
        .text(label);
    return chart
}

chart.yLabel = function(label) {
    if (!document.getElementsByTagName("ylabel").length) {
        chart.g.append("text")
            .attr("id", "ylabel")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -1. * +chart.yScale.range()[1])
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
    }

    chart.g.select('#ylabel')
        .text(label);
    return chart
}

chart.onDrag = function(drag) {
    chart.drag = d3.drag()
        .on("start", function() {
            app.dragging = true
        })
        .on("drag", function() {
            drag()
        })
        .on("end", function() {
            app.dragging = false
        })
    chart.g.select('#clip')
        .call(chart.drag);
    return chart;
}

chart.onZoom = function(zoom) {
    chart.zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", function() {
            app.zooming = true
        })
        .on("zoom", function() {
            zoom()
        })
        .on("end", function() {
            app.zooming = false
        })
    chart.g.select('#clip')
        .call(chart.zoom);
    return chart;
}

chart.init = function(reference) {
    var svg = d3.select(reference),
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
    chart.svg = svg;
    chart.width = width;
    chart.height = height;

    chart.xScale.range([0, width])
    chart.yScale.range([height, 0])

    var g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    chart.g = g;

    var clip = g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    return chart

}

//
// Line chart
//

function _draw_line(classname) {

    var lines = chart.g.select('#clip')
        .selectAll('.' + classname)
        .data(chart.data().y);

    if (app.running || app.dragging || app.zooming) {
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

    if (app.running || app.dragging || app.zooming) {
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
