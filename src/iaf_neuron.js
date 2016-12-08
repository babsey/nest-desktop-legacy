"use strict"

var $ = require("jquery");

var d3Array = require('d3-array');
var d3Axis = require('d3-axis');
var d3Ease = require('d3-ease');
var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');

var s = require("./slider");
var nodes = {};

s.iaf_slider(nodes, 'mean', {
    min: 0,
    max: 500,
    value: 250
})
s.iaf_slider(nodes, 'std', {
    min: 0,
    max: 500,
    value: 250
})
s.iaf_slider(nodes, 'C_m', {
    min: 0,
    max: 500,
    value: 250
})
s.iaf_slider(nodes, 'tau_m', {
    min: 0,
    max: 20,
    value: 10
})

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var xScale = d3Scale.scaleLinear()
    .range([0, width]);

var yScale = d3Scale.scaleLinear()
    .range([height, 0]);

var xAxis = d3Axis.axisBottom(xScale);
var yAxis = d3Axis.axisLeft(yScale);

var line = d3Shape.line()
    .x(function(d) {
        return xScale(d.x);
    })
    .y(function(d) {
        return yScale(d.y);
    });

var vth_line = d3Shape.line()
    .x(function(d) {
        return xScale(d.x);
    })
    .y(function(d) {
        return yScale(-55.);
    });

var svg = d3Selection.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);


var data, path, vth_path
$.ajax({
    method: "POST",
    url: "http://localhost:5000/init/",
    data: JSON.stringify(nodes),
    contentType: 'application/json;charset=UTF-8',
})
.fail(function() {
    alert("Check if your flask server running.")
})
.done(function(res) {
    data = res.data

    xScale.domain(d3Array.extent(data, function(d) {
        return d.x;
    }));
    yScale.domain(d3Array.extent(data, function(d) {
        return d.y
    })).nice(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("Time (ms)");

    svg.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .text("Membrane potential (mV)");

    path = svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    vth_path = svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(data)
        .attr("class", "vth line")
        .attr("d", vth_line);

})

var running = false;
function simulate() {

    if (running) {
        $('#simulate').attr('disabled', running)

        // push a new data point onto the back
        $.ajax({
            method: "POST",
            url: "http://localhost:5000/simulate/",
            data: JSON.stringify(nodes),
            contentType: 'application/json;charset=UTF-8',
        })
        .fail(function() {
            alert("Check if your flask server running.")
        })
        .done(function(res) {
            data = data.concat(res.data)

            var xmax = d3Array.max(data, function(d) {
                return d.x
            })
            xScale.domain([xmax - 1000, xmax]);
            yScale.domain(d3Array.extent(data, function(d) {
                return d.y
            })).nice(10);

            d3Selection.select(".x.axis")
                .call(xAxis);

            d3Selection.select(".y.axis")
                .call(yAxis);

            vth_path.datum(data)
                .attr("d", vth_line);

            path.datum(data)
                .attr("d", line)
                .attr("transform", null);

            data.shift();

            simulate()

        })
    }
    $('#simulate').attr('disabled', running)
}

$('#simulate').on('click', function() {
    running = true;
    simulate();
})

$('#stop').on('click', function() {
    running = false;
})
