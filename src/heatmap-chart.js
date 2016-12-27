"use strict"

var d3Array = require('d3-array');
var d3Axis = require('d3-axis');
var d3Ease = require('d3-ease');
var d3Format = require('d3-format');
var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');
var d3Transition = require('d3-transition');
var colorbrewer = require('colorbrewer');

var margin = {
        top: 20,
        right: 40,
        bottom: 30,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var xScale = d3Scale.scaleLinear()
    .range([0, width]);

var yScale = d3Scale.scaleLinear()
    .range([0, height]);

// var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];
// var colors = colorbrewer.YlGnBu[9];
// var colors = colorbrewer.YlOrRd[9];
var colors = colorbrewer.Blues[5];
// var colors = colorbrewer.Greens[9];
// var colors = colorbrewer.RdYlBu[9];
// var colors = colorbrewer.RdYlGn[9];
// var colors = colorbrewer.Set1[9];
// var colors = colorbrewer.Paired[10];

var colorScale = d3Scale.scaleQuantile()
    .range(colors);

var xAxis = d3Axis.axisBottom(xScale);
var yAxis = d3Axis.axisLeft(yScale);

var t = d3Transition.transition()
    .duration(1000)
    .ease(d3Ease.easeLinear);

var f = d3Format.format(".2f");

var _data = {
    x: [],
    y: [],
    c: [],
};

function data(d) {
    if (!arguments.length) return _data;
    _data = d;
    // clim(d3Array.extent([].concat.apply([], _data.c)));
    clim(_data.c);
    return chart;
}

function xlim(x) {
    if (!arguments.length) return d3Array.extent(_data.x);
    xScale.domain(x);
    return chart
}

function ylim(y) {
    if (!arguments.length) return d3Array.extent(_data.y);
    yScale.domain(y);
    return chart
}

function clim(c) {
    // if (!arguments.length) return d3Array.extent([].concat.apply([], _data.c));
    if (!arguments.length) return _data.c;
    colorScale.domain(c);
    return chart
}

function cmap(c) {
    if (!arguments.length) return colors;
    colorScale.range(c)
    return chart
}

function ylabel(label) {
    d3Selection.select('#ylabel')
        .text(label);
    return chart
}

function xlabel(label) {
    d3Selection.select('#xlabel')
        .text(label);
    return chart
}

function legend() {
    var l = d3Selection.select('#heatmap')
        .selectAll(".legend")
        .data(d3Array.range(colorScale.domain()[0], colorScale.domain()[1], colorScale.domain()[1]/5.))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        })
        .style("font", "10px sans-serif");

    l.append("rect")
        .attr("x", width + 26)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", function(d) {
            return colorScale(d)
        })
        .on('mouseover', function(d) {
            d3Selection.selectAll('.card')
                .filter(function(o) {
                    return o < d || o >= (d + colorScale.quantiles()[0])
                })
                .style('opacity', .1);
        })
        .on('mouseout', function() {
            d3Selection.selectAll('.card')
            // .transition(t)
            .style('opacity', 1.0);
        });

    l.append("text")
        .attr("x", width + 24)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) {
            return f(d)
        });
    return chart
}

function update() {

    d3Selection.select('#xaxis')
        .call(xAxis);

    d3Selection.select('#yaxis')
        .call(yAxis);

    var cards = d3Selection
        .select('#heatmap')
        .selectAll('.card')
        // .data([].concat.apply([], _data.c))
        .data(_data.c);

    // var cards = heatmap.enter()
    //     .append('g')
    //     .attr("class", "card")
    //     .attr("transform", function (d,i) { return "translate(" +
    //         xScale(_data.x[parseInt(i / (_data.x.length))]) + "," +
    //         yScale(_data.y[parseInt(i % (_data.y.length))]) + ")" });

    cards.selectAll('.card-fill')
        .style("fill", function(d) {
            return colorScale(d);
        });

    cards.enter().append("rect")
        .attr("transform", function (d,i) { return "translate(" +
            xScale(_data.x[parseInt(i / (_data.x.length))]) + "," +
            yScale(_data.y[parseInt(i % (_data.y.length))]) + ")" })
        .attr('class', "card-fill")
        .attr("width", width / parseFloat(_data.x.length))
        .attr("height", height / parseFloat(_data.y.length))
        .style("stroke", 'white')
        .style("fill", 'white')
        .on('mouseover', function (d) {
            d3Selection.select(this)
            .style('opacity', .3)
        })
        .on('mouseout', function (d) {
            d3Selection.select(this)
            // .transition(t)
            .style('opacity', 1.)
        })
        .transition(t)
        .style("fill", function(d) {
            return colorScale(d);
        });

    if ((width / parseFloat(_data.x.length)) > 50) {
        cards.append("text")
            .attr("y", yScale(.5))
            .attr("x", xScale(.5))
            .text(function(d) {
                return f(d)
            })
            .attr("fill", function(d) {
                return d <= .5 ? "#000" : "#fff"
            })
            // .style("stroke-width", 1)
            .style("z-index", "10")
            .style("text-anchor", "middle")
    }

    cards.exit().remove();

    return chart;
}

function heatmapChart(reference) {
    d3Selection.select(reference).html("");

    var svg = d3Selection.select(reference).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .call(yAxis);

    svg.append("text")
        .attr("id", "xlabel")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5);

    svg.append("text")
        .attr("id", "ylabel")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end");

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'heatmap')
        .attr("transform", "translate(1,0)");

    return chart
}

var chart = {
    data: data,
    cmap: cmap,
    xlim: xlim,
    ylim: ylim,
    clim: clim,
    colorScale: colorScale,
    xlabel: xlabel,
    ylabel: ylabel,
    legend: legend,
    update: update,
}

module.exports = heatmapChart
