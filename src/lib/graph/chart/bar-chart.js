"use strict"

//
// Bar-chart
//

const d3 = require('d3');

var chart = {
    data: {},
    axis: {
        x: {},
        y: {},
    },
};

chart.tooltip = function() {
    var mx = chart.xScale.invert(d3.mouse(this)[0]);
    var my = chart.yScale.invert(d3.mouse(this)[1]);

    $('#point').html(() => {
        var point = '';
        point += app.format.number(mx, 1);
        point += (chart.axis.x.unit ? '&thinsp;' + chart.axis.x.unit : '');
        point += ', ';
        point += app.format.number(my, 1);
        point += (chart.axis.y.unit ? '&thinsp;' + chart.axis.y.unit : '');
        if ('mean' in chart.axis.data) {
            point += ' (&micro;:&thinsp;';
            point += app.format.number(chart.axis.data.mean, 1);
            point += (chart.axis.data.unit ? '&thinsp;' + chart.axis.data.unit : '');
            if ('deviation' in chart.axis.data) {
                point += ', &sigma;:&thinsp;';
                point += app.format.number(chart.axis.data.deviation, 1);
                point += (chart.axis.data.unit ? '&thinsp;' + chart.axis.data.unit : '');
            }
            point += ')';
        }
        return point
    })

}

chart.yVal = (d, idx) => {
    idx = idx || 'y';
    if (typeof idx == 'number' || idx == 'y') {
        var y = d[idx]
    } else {
        var y = idx.map((i) => d[i]).reduce((acc, val) => acc + val)
    }
    return y || 0
}

chart.update = (recorder) => {
    chart.g.style('display', 'none')
    if (!chart.data) return

    chart.xScale.range([0, +chart.g.attr('width')])
    chart.yScale.range([+chart.g.attr('height'), 0])

    // if (app.selected_node && app.selected_node.element_type == 'neuron' && recorder.sources.indexOf(app.selected_node.id) != -1) {
    //     var nidx = app.selected_node.id;
    //     var idx = app.selected_node.ids.map((d) => recorder.senders.indexOf(d))
    // } else {
    var nidx = null;
    var idx = 'y';
    // }

    chart.xScale.domain(chart.axis.x.domain || app.graph.chart.xScale.domain())
    chart.yScale.domain(chart.axis.y.domain || [0, d3.max(chart.data, (d) => chart.yVal(d, idx.length == 1 ? idx[0] : idx))])
    app.graph.chart.axesUpdate(chart, recorder)

    var bars = chart.g.select('#clip')
        .selectAll('.bar')
        .data(chart.data);

    var labels = chart.g.select('#clip')
        .selectAll('.label')
        .data(chart.data);
    chart.bars = bars;

    var colors = app.graph.colors();
    var cidx = (recorder.sources.length == 1 ? recorder.sources[0] : nidx)
    var color = app.config.app().graph.color ? colors[cidx || (recorder.node.id % colors.length)] : ''

    bars.attr('x', (d) => chart.xScale(d.x0))
        .attr('width', (d) => chart.xScale(d.x1) - chart.xScale(d.x0));

    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => chart.xScale(d.x0))
        .attr('width', (d) => chart.xScale(d.x1) - chart.xScale(d.x0))
        .attr('y', chart.g.attr('height'))

    var barsDraw = app.graph.chart.doTransition() ? bars.transition(app.graph.chart.transition) : bars;
    barsDraw.attr('y', (d) => chart.yScale(chart.yVal(d, idx)))
        .attr('height', (d) => Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx))))
        .style('fill', color);

    var barsNewDraw = app.graph.chart.doTransition() ? bars.enter().selectAll('.bar').transition(app.graph.chart.transition) : bars.enter().selectAll('.bar');
    barsNewDraw.attr('y', (d) => chart.yScale(chart.yVal(d, idx)))
            .attr('height', (d) => Math.max(0, +chart.g.attr('height') - chart.yScale(chart.yVal(d, idx))))
            .style('fill', color);

    bars.exit()
        .remove()

    var numberFormat = (recorder.node.subchart.ordinate == 'rate' ? 1 : 0);

    labels
        .classed('hide', (d) => {
            return (d.x1 - d.x0) < (numberFormat ? 50 : 20)
        })
        .text((d) => {
            return app.format.number(d.y, numberFormat)
        })
        .attr('x', (d) => chart.xScale(d.x))
        .attr('y', (d) => chart.yScale(d.y) + 17)

    labels.enter().append('text')
        .attr('class', 'label')
        .classed('hide', (d) => {
            return (d.x1 - d.x0) < (numberFormat ? 50 : 20)
        })
        .text((d) => {
            return app.format.number(d.y, numberFormat)
        })
        .attr('x', (d) => chart.xScale(d.x))
        .attr('y', (d) => chart.yScale(d.y) + 17)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .attr('fill', 'white')

    labels.exit().remove()

    chart.g.style('display', null)
}

chart.init = (recorder, options) => {
    // console.log('Init bar chart')
    chart.recorder = recorder;
    chart.options = options;

    var margin = {
        top: 10,
        right: 0,
        bottom: 25,
        left: 0,
    };

    var g = d3.select('#chart'),
        width = app.graph.chart.width,
        height = (options.height ? options.height : app.graph.chart.height) - margin.top - margin.bottom;
    chart.width = width;
    chart.height = height;

    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, width])
    chart.yScale = d3.scaleLinear();
    chart.yScale.range([height, 0])

    chart.g = g.append('g')
        .attr('height', height)
        .attr('width', width)
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
        .attr('fill', 'white')
        .style('opacity', 0);

    app.graph.chart.xAxis(chart);
    app.graph.chart.yAxis(chart);
    app.graph.chart.onDrag(chart);
    app.graph.chart.onZoom(chart);
}

module.exports = chart;
