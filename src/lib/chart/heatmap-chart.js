"use strict"

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

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

var colors = colorbrewer.Blues[9]
chart.colorScale = d3.scaleQuantile()
    .range(colors);

chart.format = d3.format(".2f");

chart.transition = d3.transition()
    .ease(d3.easeLinear)
    .duration(1);

var _xAxis, _yAxis;

var _data = {
    x: [],
    y: [],
    c: [],
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
        .attr("transform", "translate(0,0)")
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
            dragging = true
        })
        .on("drag", function() {
            drag()
        })
        .on("end", function() {
            dragging = false
        })
    chart.g.select('#clip')
        .call(chart.drag);
    return chart;
}

chart.onZoom = function(zoom) {
    chart.zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", function() {
            zooming = true
        })
        .on("zoom", function() {
            zoom()
        })
        .on("end", function() {
            zooming = false
        })
    chart.g.select('#clip')
        .call(chart.zoom);
    return chart;
}

chart.init = function(reference,size) {
    var svg = d3.select(reference),
        width = (size.width ? size.width : +svg.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +svg.attr("height")) - margin.top - margin.bottom;
    chart.svg = svg;
    chart.width = width;
    chart.height = height;

    chart.xScale.range([0, width])
    chart.yScale.range([height, 0])

    var g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) +")");
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
// Heatmap-chart
//


function legend() {
    var l = chart.g.select('#heatmap')
        .selectAll(".legend")
        .data(d3.range(
            chart.colorScale.domain()[0],
            chart.colorScale.domain()[1],
            chart.colorScale.domain()[1] / 5.))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        })
        .style("font", "10px sans-serif");

    l.append("rect")
        .attr("x", chart.width + 26)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", function(d) {
            return chart.colorScale(d)
        })
        .on('mouseover', function(d) {
            chart.g.selectAll('.card')
                .filter(function(o) {
                    return o < d || o >= (d + chart.colorScale.quantiles()[0])
                })
                .style('opacity', .1);
        })
        .on('mouseout', function() {
            chart.g.selectAll('.card')
                .transition(t)
                .style('opacity', 1.0);
        });

    l.append("text")
        .attr("x", chart.width + 24)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) {
            return chart.format(d)
        });
    return chart
}

function update() {
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.range([0, +chart.g.attr('width')])

    var data = chart.data();

    chart.g.select('#xaxis')
        .call(chart.xAxis());

    chart.g.select('#yaxis')
        .call(chart.yAxis());

    var cards = chart.g
        .select('#clip')
        .selectAll('.card')
        .data(chart.data().i);

    cards.selectAll('.card-fill').remove();

    cards.enter().append("rect")
        .attr("transform", function(d, i) {
            return "translate(" +
                chart.xScale(data.x[parseInt(i / (data.x.length))]) + "," +
                chart.yScale(data.y[parseInt(i % (data.y.length))] + 1) + ")"
        })
        .attr('class', "card-fill")
        .attr('title', function(d, i) {
            return chart.format(data.c[i])
        })
        .attr("width", chart.width / parseFloat(data.x.length))
        .attr("height", chart.height / parseFloat(data.y.length))
        .style("stroke", 'white')
        .on('mouseover', function(d) {
            d3.select(this)
                .style('opacity', .3)
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .style('opacity', 1.)
        })
        .style("fill", function(d, i) {
            return chart.colorScale(data.c[i]);
        });

    if ((chart.width / parseFloat(data.x.length)) > 50) {

        cards.selectAll('text')
            .text(function(d) {
                return chart.format(d)
            })

        cards.enter().append("text")
            .attr("transform", function(d, i) {
                return "translate(" +
                    chart.xScale(data.x[parseInt(i / (data.x.length))]) + ",-" +
                    chart.yScale(data.y.length - data.y[parseInt(i % (data.y.length))]) + ")"
            })
            .attr("x", chart.xScale(.5))
            .attr("y", chart.yScale(.5))
            .text(function(d) {
                return chart.format(d)
            })
            .attr("fill", function(d) {
                return d <= .5 ? "#000" : "#fff"
            })
            .style("stroke-width", 1)
            .style("z-index", "10")
            .style("text-anchor", "middle")
    }

}

chart.legend = legend
chart.update = update
module.exports = chart.init
