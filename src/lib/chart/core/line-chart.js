"use strict"

//
// Line chart
//

const d3 = require("d3");

var chart = {
    data: {}
};

chart.subplot = (i) => -1 * (chart.data.n - (i % chart.data.n) - 1) * chart.height / chart.data.n;

chart.draw_line = (series) => {

    var lines = chart.g.select('#clip')
        .selectAll('.line')
        .data(chart.data.y);

    var g = lines.enter()
        .append('g')
        .attr('class', 'subplot')

    lines.attr("style", (d, i) => 'stroke:' + (app.selected_node ? chart.data.c[i] : ''))

    var subplot = (i) => -1 * (chart.data.n - (i % chart.data.n) - 1) * chart.height / chart.data.n;
    var color = (i) => app.config.app().chart.color ? chart.data.c[i % chart.data.c.length] : '';
    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    if (transition) {
        lines
            .transition(app.chart.transition)
            .attr('height', chart.height / chart.data.n)
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + chart.subplot(i) + ")" : ''
            )
            .attr("style", (d, i) => 'stroke:' + color(i))
            .attr("d", chart.line);

        g.append("path")
            .attr('height', chart.height / chart.data.n)
            .attr("class", (d, i) => 'line line_' + i)
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + chart.subplot(i) + ")" : ''
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
            .attr("style", 'zscore: 1')
            .attr("style", (d, i) => 'stroke:' + color(i))
            // .transition(app.chart.transition)
            .attr("d", (d) => chart.line(d));

    } else {
        lines.attr('height', chart.height / chart.data.n)
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + chart.subplot(i) + ")" : ''
            )
            .attr("style", (d, i) => 'stroke:' + color(i))
            .attr("d", chart.line)

        lines.selectAll('.overlay')
            .attr("width", chart.width)
            .attr("height", chart.height / chart.data.n)
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + -1 * +chart.subplot(chart.data.n - i - 1) + ")" : ''
            )

        g.append("path")
            .attr('height', chart.height / chart.data.n)
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + chart.subplot(i) + ")" : ''
            )
            .attr("class", (d, i) => 'line line_' + i)
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
            .attr("style", 'zscore: 1')
            .attr("style", (d, i) => 'stroke:' + color(i))
            .attr("d", chart.line);
    }

    lines.selectAll('.overlay')
        .attr("width", chart.width)
        .attr("height", chart.height / chart.data.n)
        .attr("transform",
            (d, i) => series == 'stack' ? "translate(0," + -1 * +chart.subplot(chart.data.n - i - 1) + ")" : ''
        );

    var overlay = g.append('rect')
        .attr('class', 'overlay')
        .attr("width", chart.width)
        .attr("height", chart.height / chart.data.n)
        .attr("transform",
            (d, i) => series == 'stack' ? "translate(0," + -1 * +chart.subplot(chart.data.n - i - 1) + ")" : ''
        );

    overlay.on("mouseover", () => {
            chart.focus.style("display", null);
        })
        .on("mouseout", () => {
            $('#point').empty()
            chart.focus.style("display", "none");
        })
        .on("mousemove", chart.tooltip)

    lines.exit()
        .remove();
}

chart.update = (recorder) => {
    chart.g.style('display', 'none')

    if (!chart.data.x) return
    chart.xScale.domain(app.chart.xScale.domain())

    chart.g.attr('height', recorder.node.series == "overlap" ? chart.height : chart.height / chart.data.n)
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.domain(app.chart.xScale.domain())
    chart.yScale.domain(d3.extent([].concat.apply([], chart.data.y)))

    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    app.chart.axesUpdate(chart, transition)

    app.chart.xLabel(chart, 'xLabel_' + app.simulation.recorders.indexOf(recorder), (app.model.record_labels[app.chart.abscissa] || app.chart.abscissa))
    var ylabel = app.model.record_labels[$('#record_' + recorder.node.id).val() || recorder.node.record_from[0]]
    app.chart.yLabel(chart, 'yLabel_' + app.simulation.recorders.indexOf(recorder), ylabel)

    chart.line
        .x((d, i) => chart.xScale(chart.data.x[i]))
        .y((d) => chart.yScale(d));

    var bisect = d3.bisector((d) => d).left;

    chart.tooltip = function(d, i) {
        var x = chart.data.x;
        var y = chart.data.y[i];
        var offset = chart.subplot(i);
        var x0 = chart.xScale.invert(d3.mouse(this)[0]);

        var idx = bisect(x, x0, 1),
            d0 = x[idx - 1],
            d1 = x[idx],
            idx = x0 - y[idx - 1] > y[idx] - x0 ? idx : idx - 1;
        chart.focus.attr("transform",
            () => "translate(" + chart.xScale(x[idx]) + "," + (+chart.yScale(y[idx]) + offset) + ")"
        );
        // chart.focus.select("text").text(() => {
        //     return app.format.number(x[idx], 1) + ', ' + app.format.number(y[idx]);
        // });
        $('#point').html(() => app.format.number(x[idx], 1) + ', ' + app.format.number(y[idx]))
        chart.focus.select(".y-hover-line").attr("x1", () => chart.width - chart.xScale(x[idx]));
        chart.focus.select(".y-hover-line").attr("x2", () => -chart.xScale(x[idx]));
        chart.focus.select(".x-hover-line").attr("y1", () => -chart.yScale(y[idx]) - offset);
        chart.focus.select(".x-hover-line").attr("y2", () => chart.height - chart.yScale(y[idx]) - offset);

    }

    chart.draw_line(recorder.node.series || 'stack')
    app.chart.legend(chart, chart.data.legend, chart.data.c)

    chart.g.style('display', null)
}

chart.init = (reference, id, size) => {

    var margin = {
        top: 20,
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

    chart.g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) + ")");

    chart.focus = chart.g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    chart.focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", chart.height);

    chart.focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", chart.width);

    chart.focus.append("circle")
        .attr("r", 2.5);
    //
    // chart.focus.append("rect")
    //     .attr("x", 15)
    //     .attr("y", "-17")
    //     .attr('height', 16)
    //     .attr('width', 85)
    //     .attr('fill', 'white');

    chart.focus.append("text")
        .attr("x", 15)
        .attr("dy", "-.31em");


    var clip = chart.g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');
    //
    // // Add area for dragging event
    // clip.append("rect")
    //     .attr('width', width)
    //     .attr('height', height)
    //     .attr('fill', 'white');

    app.chart.xAxis(chart);
    app.chart.yAxis(chart);
    app.chart.onDrag(chart);
    app.chart.onZoom(chart);

    chart.line = d3.line();
}

module.exports = chart
