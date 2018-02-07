"use strict"

//
// Scatter chart
//

const d3 = require("d3");

var chart = {
    data: {}
};

chart.update = (recorder) => {
    chart.g.style('display', 'none')

    if (!chart.data.x) return
    chart.yScale.range([chart.height, 0])
    chart.xScale.range([0, chart.width])
    chart.xScale.domain(app.graph.chart.xScale.domain())
    chart.yScale.domain([d3.max(recorder.senders) + 1, d3.min(recorder.senders) - 1])

    var transition = !(app.simulation.running || app.graph.dragging || app.graph.chart.zooming || app.resizing || app.mouseover)
    app.graph.chart.axesUpdate(chart, transition)

    var xData = app.graph.chart.dataModel[app.graph.chart.abscissa];
    var xLabel = xData.label;
    var xUnit = (xData.unit ? ' (' + xData.unit + ')' : '');
    app.graph.chart.xLabel(chart, 'xLabel_' + app.simulation.recorders.indexOf(recorder), xLabel + xUnit)

    var dots = chart.g.select('#clip')
        .selectAll(".dot")
        .data(chart.data.x);

    var color = app.config.app().graph.color;
    dots.attr("fill", (d, i) => color ? chart.data.c[i] : '')
        .attr("cx", (d) => chart.xScale(d))
        .attr("cy", (d, i) => chart.yScale(chart.data.y[i]))

    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("fill", (d, i) => color ? chart.data.c[i] : '')
        .attr("cx", (d) => chart.xScale(d))
        .attr("cy", (d, i) => chart.yScale(chart.data.y[i]))
        .merge(dots);

    dots.exit()
        .remove();

    chart.g.style('display', null)
}


chart.init = (reference, id, size) => {
    // console.log('Init scatter chart')

    var margin = {
        top: 10,
        right: 0,
        bottom: 25,
        left: 0
    };

    var svg = d3.select(reference),
        width = app.graph.chart.width,
        height = (size.height ? size.height : app.graph.chart.height) - margin.top - margin.bottom;
    chart.width = width;
    chart.height = height;

    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, width])
    chart.yScale = d3.scaleLinear();
    chart.yScale.range([height, 0])


    chart.g = svg.append("g")
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) + ")");

    var clip = chart.g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    app.graph.chart.xAxis(chart);
    app.graph.chart.yAxis(chart);
    // app.graph.chart.xLabel(chart, 'xLabel_'+id, 'Time [ms]');
    app.graph.chart.yLabel(chart, 'yLabel_' + id, 'Neuron ID');
    app.graph.chart.onDrag(chart);
    app.graph.chart.onZoom(chart);
}

module.exports = chart;
