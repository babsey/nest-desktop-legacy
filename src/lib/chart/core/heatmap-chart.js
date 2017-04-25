"use strict"

//
// Heatmap-chart
//

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

var chart = {};

chart.legend = function(scale) {
    var l = chart.g.select('#heatmap')
        .selectAll(".legend")
        .data(d3.range(
            scale.domain()[0],
            scale.domain()[1],
            scale.domain()[1] / 5.))
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
            return scale(d)
        })
        .on('mouseover', function(d) {
            chart.g.selectAll('.card')
                .filter(function(o) {
                    return o < d || o >= (d + scale.quantiles()[0])
                })
                .style('opacity', .1);
        })
        .on('mouseout', function() {
            chart.g.selectAll('.card')
                .transition(app.chart.transition)
                .style('opacity', 1.0);
        });

    l.append("text")
        .attr("x", chart.width + 24)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) {
            return app.chart.format(d)
        });
    return chart
}

chart.update = function(data) {
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.range([0, +chart.g.attr('width')])
    app.chart.axesUpdate(chart, false)

    var cards = chart.g
        .select('#clip')
        .selectAll('.card')
        .data(data.i);

    cards.selectAll('.card-fill').remove();

    cards.enter().append("rect")
        .attr("transform", function(d, i) {
            return "translate(" +
                chart.xScale(data.x[parseInt(i / (data.x.length))]) + "," +
                chart.yScale(data.y[parseInt(i % (data.y.length))] + 1) + ")"
        })
        .attr('class', "card-fill")
        .attr('title', function(d, i) {
            return app.chart.format(data.c[i])
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
                return app.chart.format(d)
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
                return app.chart.format(d)
            })
            .attr("fill", function(d) {
                return d <= .5 ? "#000" : "#fff"
            })
            .style("stroke-width", 1)
            .style("z-index", "10")
            .style("text-anchor", "middle")
    }

}

chart.init = function(reference, id, size) {
    var margin = {
        top: 10,
        right: 40,
        bottom: 40,
        left: 50
    };

    var svg = d3.select(reference),
        width = (size.width ? size.width : +svg.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +svg.attr("height")) - margin.top - margin.bottom;
    chart.width = width;
    chart.height = height;

    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, width])
    chart.yScale = d3.scaleLinear();
    chart.yScale.range([height, 0])

    var colors = colorbrewer.Blues[9]
    chart.colorScale = d3.scaleQuantile()
        .range(colors);

    var g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) + ")");
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

module.exports = chart
