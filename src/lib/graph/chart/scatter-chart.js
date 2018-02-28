"use strict"

//
// Scatter chart
//

const d3 = require('d3');

var chart = {
    data: {},
    axis: {
        x: {},
        y: {},
    }
};

chart.tooltip = function() {
    var mx = chart.xScale.invert(d3.mouse(this)[0]);
    var my = chart.yScale.invert(d3.mouse(this)[1]);

    $('#point').html(() => {
        var point = '';
        point += app.format.number(mx, 1);
        if (chart.axis) {
            point += '&thinsp;';
            point += chart.axis.x.unit;
        }
        point += ', ';
        point += app.format.number(my, 0);
        return point
    })

}

chart.update = (recorder) => {
    chart.g.style('display', 'none')

    if (!chart.data) return
    if (!chart.data.x) return
    chart.yScale.range([chart.height, 0])
    chart.xScale.range([0, chart.width])
    chart.xScale.domain(chart.axis.x.domain || app.graph.chart.xScale.domain())
    chart.yScale.domain(chart.axis.y.domain || [d3.max(recorder.senders) + 1, d3.min(recorder.senders) - 1])
    app.graph.chart.axesUpdate(chart, recorder)

    var dots = chart.g.select('#clip')
        .selectAll('.dot')
        .data(chart.data.x);

    var color = app.config.app().graph.color;
    dots.attr('fill', (d, i) => color ? chart.data.c[i] : '')
        .attr('cx', (d) => chart.xScale(d))
        .attr('cy', (d, i) => chart.yScale(chart.data.y[i]))

    dots.enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 2)
        .attr('fill', (d, i) => color ? chart.data.c[i] : '')
        .attr('cx', (d) => chart.xScale(d))
        .attr('cy', (d, i) => chart.yScale(chart.data.y[i]))
        .merge(dots);

    dots.exit()
        .remove();

    chart.g.style('display', null)
}


chart.init = (recorder, options) => {
    // console.log('Init scatter chart')
    chart.recorder = recorder;
    chart.options = options;

    var margin = {
        top: 10,
        right: 0,
        bottom: 25,
        left: 0
    };

    var svg = d3.select('#chart'),
        width = app.graph.chart.width,
        height = (options.height ? options.height : app.graph.chart.height) - margin.top - margin.bottom;
    chart.width = width;
    chart.height = height;

    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, width])
    chart.yScale = d3.scaleLinear();
    chart.yScale.range([height, 0])

    chart.g = svg.append('g')
        .attr('recorder', recorder.idx)
        .attr('subchart', chart.idx)
        .attr('transform', 'translate(' + (margin.left + (options.x ? options.x : 0)) + ',' + (margin.top + (options.y ? options.y : 0)) + ')');

    var clip = chart.g.append('g')
        .attr('clip-path', 'url(#clip)')
        .attr('id', 'clip')
        .on('mouseout', () => $('#point').empty())
        .on('mousemove', chart.tooltip);

    // add area for dragging event
    clip.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    app.graph.chart.xAxis(chart);
    app.graph.chart.yAxis(chart);
    app.graph.chart.onDrag(chart);
    app.graph.chart.onZoom(chart);
}

module.exports = chart;
