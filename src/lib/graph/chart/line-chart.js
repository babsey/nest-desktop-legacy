"use strict"

//
// Line chart
//

const d3 = require('d3');

var chart = {
    data: {},
    axis: {
        x: {},
        y: {},
    },
};

chart.subchart = (height, n, i) => (-1 * (n - (i % n) - 1) * height / n)

chart.tooltip = function(d, i) {
    var x = chart.data.x;
    var y = chart.data.y[i];
    var offset = chart.subchart(chart.height, chart.data.n, i);
    var x0 = app.graph.chart.xScale.invert(d3.mouse(this)[0]);

    var bisect = d3.bisector((d) => d).left;
    var bisect_idx = bisect(x, x0, 1);
    var idx = (x0 - y[bisect_idx - 1] > y[bisect_idx] - x0) ? bisect_idx : bisect_idx - 1;

    $('#point').html(() => {
        var point = '';
        point += app.format.number(x[idx], chart.axis.x.format != undefined ? chart.axis.x.format : 2);
        point += (chart.axis.x.unit ? '&thinsp;' + chart.axis.x.unit : '');
        point += ', ';
        point += app.format.number(y[idx], chart.axis.y.format != undefined ? chart.axis.y.format : 2 );
        point += (chart.axis.y.unit ? '&thinsp;' + chart.axis.y.unit : '');
        point += ' (';
        point += '&micro;:&thinsp;';
        point += app.format.number(d3.mean(y), 2)
        point += (chart.axis.y.unit ? '&thinsp;' + chart.axis.y.unit : '');
        point += ', ';
        point += '&sigma;:&thinsp;';
        point += app.format.number(d3.deviation(y), 2)
        point += (chart.axis.y.unit ? '&thinsp;' + chart.axis.y.unit : '');
        point += ')';
        return point
    })

    chart.focus.attr('transform',
        () => 'translate(' + chart.xScale(x[idx]) + ',' + (+chart.yScale(y[idx]) + offset) + ')'
    );
    chart.focus.select('.y-hover-line').attr('x1', () => chart.width - chart.xScale(x[idx]));
    chart.focus.select('.y-hover-line').attr('x2', () => -chart.xScale(x[idx]));
    // chart.focus.select('.x-hover-line').attr('y1', () => -chart.yScale(y[idx]) - offset);
    // chart.focus.select('.x-hover-line').attr('y2', () => chart.height - chart.yScale(y[idx]) - offset);
    chart.focus.select('.x-hover-line').attr('y1', () => -5*chart.height);
    chart.focus.select('.x-hover-line').attr('y2', () => 5*chart.height);

}

chart.draw_line = (recorder) => {

    var series = recorder.node.series || 'stack';
    app.graph.chart.drawing = true;
    var n = chart.data.n || 1;

    var lines = chart.g.select('#clip')
        .selectAll('.line')
        .data(chart.data.y);

    var g = lines.enter()
        .append('g')
        .attr('class', 'subchart')

    // lines.attr('style', (d, i) => 'stroke:' + (app.selected_node ? chart.data.c[i] : ''))

    var color = (i) => app.config.app().graph.color ? chart.data.colors[i % chart.data.colors.length] : '';
    var yTranslate = (i) => +chart.subchart(chart.height, n, i);
    if (app.graph.chart.doTransition()) {
        lines
            .transition(app.graph.chart.transition)
            .attr('transform',
                (d, i) => series == 'stack' ? 'translate(0,' + yTranslate(i) + ')' : ''
            )
            .attr('style', (d, i) => 'stroke:' + color(i))
            .attr('d', chart.line);

        g.append('path')
            .attr('class', (d, i) => 'line line_' + i)
            .attr('transform',
                (d, i) => series == 'stack' ? 'translate(0,' + yTranslate(i) + ')' : ''
            )
            .on('mouseover', (d, i) => {
                chart.g.selectAll('#clip')
                    .classed('active', true);
                chart.g.selectAll('.aline.line_' + i)
                    .classed('active', true);
            })
            .on('mouseout', (d, i) => {
                chart.g.selectAll('#clip')
                    .classed('active', false)
                chart.g.selectAll('#clip path')
                    .classed('active', false);
            })
            .attr('style', 'zscore: 1')
            .attr('style', (d, i) => 'stroke:' + color(i))
            .transition(app.graph.chart.transition)
            .attr('d', chart.line);

    } else {
        lines.attr('transform',
                (d, i) => series == 'stack' ? 'translate(0,' + yTranslate(i) + ')' : ''
            )
            .attr('style', (d, i) => 'stroke:' + color(i))
            .attr('d', chart.line)

        lines.selectAll('.overlay')
            .attr('transform',
                (d, i) => series == 'stack' ? 'translate(0,' + -1 * yTranslate(i) + ')' : ''
            )

        g.append('path')
            .attr('transform',
                (d, i) => series == 'stack' ? 'translate(0,' + yTranslate(i) + ')' : ''
            )
            .attr('class', (d, i) => 'line line_' + i)
            .on('mouseover', (d, i) => {
                chart.g.selectAll('#clip')
                    .classed('active', true);
                chart.g.selectAll('.aline.line_' + i)
                    .classed('active', true);
            })
            .on('mouseout', (d, i) => {
                chart.g.selectAll('#clip')
                    .classed('active', false)
                chart.g.selectAll('#clip path')
                    .classed('active', false);
            })
            .attr('style', 'zscore: 1')
            .attr('style', (d, i) => 'stroke:' + color(i))
            .attr('d', chart.line);
    }

    var yTranslate = (i) => +chart.subchart(chart.height, n, i);

    if (chart.data.V_th) {

        var line = d3.line()
            .x((d, i) => chart.xScale(chart.data.V_th.x[i]))
            .y((d) => chart.yScale(d));

        // Select the path.
        var Vth_line = chart.g.selectAll('.Vth_line')
            .data(chart.data.V_th.y);

        var yDomain = chart.yScale.domain();

        // Change the path.
        Vth_line
            .style('display', (d) => (d[0] > yDomain[0] && d[0] <= yDomain[1] ? '' : 'none'))
            .attr('d', line);

        // Add the path.
        Vth_line.enter().append('path')
            .attr('class', 'Vth_line')
            .style('display', (d) => (d[0] > yDomain[0] && d[0] <= yDomain[1] ? '' : 'none'))
            .attr('transform',
                (d, i) => series == 'stack' ? 'translate(0,' + yTranslate(i) + ')' : ''
            )
            .attr('d', line);

        // Delete the path.
        Vth_line.exit().remove();
    }

    lines.selectAll('.overlay')
        .attr('width', chart.width)
        .attr('height', chart.height / n)
        .attr('transform',
            (d, i) => series == 'stack' ? 'translate(0,' + -1 * yTranslate(i) + ')' : ''
        );

    var overlay = g.append('rect')
        .attr('class', 'overlay')
        .attr('width', chart.width)
        .attr('height', chart.height / n)
        .attr('transform',
            (d, i) => series == 'stack' ? 'translate(0,' + -1 * yTranslate(i) + ')' : ''
        );

    overlay.on('mouseout', () => {
            chart.focus.attr('transform', 'translate(-1000,-1000)');
            $('#point').empty();
        })
        .on('mousemove', chart.tooltip)

    g.exit().remove();

    lines.exit()
        .remove();

    app.graph.chart.drawing = false;
}

chart.update = (recorder) => {
    chart.g.style('display', 'none')
    if (!chart.data) return
    if (!chart.data.y) return
    if (chart.data.y.length == 0) return

    var x = chart.data.x;
    var y = chart.data.y;
    var n = chart.data.n || 1;

    var xDomain = chart.axis.x.domain || app.graph.chart.xScale.domain();
    var height = recorder.node.series == 'overlap' ? chart.height : chart.height / n;
    var yDomain = d3.extent(d3.merge(y));
    var dy = (yDomain[1] - yDomain[0]) * .05;

    chart.xScale.range([0, chart.width]).domain(xDomain)
    chart.yScale.range([chart.height, chart.height - height]).domain([yDomain[0] - dy, yDomain[1] + dy])
    app.graph.chart.axesUpdate(chart, recorder)

    var xVal = (idx) => (x.length == y.length) ? x[idx] : x;
    chart.line
        .x((d,i,j) => chart.xScale(xVal(j.idx)[i]))
        .y((d) => chart.yScale(d));

    // if ('V_m' in recorder.events) {
    //     if (recorder.node.data_from.indexOf('V_m') != -1) {
    //         chart.data.V_th = recorder.senders.map(
    //             (sender) => {
    //                 var V_th = app.data.nodes.filter((node) => node.ids.indexOf(sender) != -1)[0].params.V_th;
    //                 return (yDomain[1] > V_th) ? chart.data.x.map( (d) => V_th ) : [] }
    //             )
    //     }
    // }
    chart.draw_line(recorder)
    app.graph.chart.legend(chart, chart.data.legend, chart.data.colors)

    chart.g.style('display', null)
}

chart.init = (recorder, options) => {
    // console.log('Init line chart')
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

    chart.focus = chart.g.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(-1000,-1000)');

    chart.focus.append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1', 0)
        .attr('y2', chart.height);

    chart.focus.append('line')
        .attr('class', 'y-hover-line hover-line')
        .attr('x1', 0)
        .attr('x2', chart.width);

    chart.focus.append('circle')
        .attr('r', 2.5);
    //
    // chart.focus.append('rect')
    //     .attr('x', 15)
    //     .attr('y', '-17')
    //     .attr('height', 16)
    //     .attr('width', 85)
    //     .attr('fill', 'white');

    chart.focus.append('text')
        .attr('x', 15)
        .attr('dy', '-.31em');


    var clip = chart.g.append('g')
        .attr('clip-path', 'url(#clip)')
        .attr('id', 'clip');
    //
    // // Add area for dragging event
    // clip.append('rect')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .attr('fill', 'white');

    app.graph.chart.xAxis(chart);
    app.graph.chart.yAxis(chart);
    app.graph.chart.onDrag(chart);
    app.graph.chart.onZoom(chart);

    chart.line = d3.line();
}

module.exports = chart
