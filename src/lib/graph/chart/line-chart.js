"use strict"

//
// Line chart
//

const d3 = require("d3");

var chart = {
    data: {}
};

chart.subplot = (i) => -1 * (chart.data.n - (i % chart.data.n) - 1) * chart.height / chart.data.n;

chart.tooltip = function(d, i) {
    var x = chart.data.x;
    var y = chart.data.y[i];
    var offset = chart.subplot(i);
    var x0 = app.graph.chart.xScale.invert(d3.mouse(this)[0]);

    var bisect = d3.bisector((d) => d).left;

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
    $('#point').html(() => app.format.number(x[idx], 1) + (chart.xData.unit ? '&thinsp;' + chart.xData.unit : '') +
        ', ' + app.format.number(y[idx]) + (chart.yData.unit ? '&thinsp;' + chart.yData.unit : ''))
    chart.focus.select(".y-hover-line").attr("x1", () => chart.width - chart.xScale(x[idx]));
    chart.focus.select(".y-hover-line").attr("x2", () => -chart.xScale(x[idx]));
    chart.focus.select(".x-hover-line").attr("y1", () => -chart.yScale(y[idx]) - offset);
    chart.focus.select(".x-hover-line").attr("y2", () => chart.height - chart.yScale(y[idx]) - offset);

}

chart.draw_line = (series) => {
    app.graph.chart.drawing = true;

    var lines = chart.g.select('#clip')
        .selectAll('.line')
        .data(chart.data.y);

    var g = lines.enter()
        .append('g')
        .attr('class', 'subplot')

    // lines.attr("style", (d, i) => 'stroke:' + (app.selected_node ? chart.data.c[i] : ''))

    var subplot = (i) => -1 * (chart.data.n - (i % chart.data.n) - 1) * chart.height / chart.data.n;
    var color = (i) => app.config.app().graph.color ? chart.data.c[i % chart.data.c.length] : '';

    var transition = !(app.simulation.running || app.graph.dragging || app.graph.chart.zooming || app.resizing || app.mouseover)
    if (transition) {
        lines
            .transition(app.graph.chart.transition)
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + chart.subplot(i) + ")" : ''
            )
            .attr("style", (d, i) => 'stroke:' + color(i))
            .attr("d", chart.line);

        g.append("path")
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
            .transition(app.graph.chart.transition)
            .attr("d", (d) => chart.line(d));

    } else {
        lines.attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + chart.subplot(i) + ")" : ''
            )
            .attr("style", (d, i) => 'stroke:' + color(i))
            .attr("d", chart.line)

        lines.selectAll('.overlay')
            .attr("transform",
                (d, i) => series == 'stack' ? "translate(0," + -1 * +chart.subplot(chart.data.n - i - 1) + ")" : ''
            )

        g.append("path")
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

    app.graph.chart.drawing = false;
}

chart.update = (recorder) => {
    chart.g.style('display', 'none')

    if (!chart.data.x) return
    chart.xScale.domain(app.graph.chart.xScale.domain())
    chart.xScale.range([0, chart.width])
    var height = recorder.node.series == "overlap" ? chart.height : chart.height / chart.data.n
    chart.yScale.range([chart.height, chart.height - height])
    chart.xScale.domain(app.graph.chart.xScale.domain())
    chart.yScale.domain(d3.extent([].concat.apply([], chart.data.y)))

    var transition = !(app.simulation.running || app.graph.dragging || app.graph.chart.zooming || app.resizing || app.mouseover)
    app.graph.chart.axesUpdate(chart, transition)

    var dataModel = app.config.nest('data');
    chart.xData = app.graph.chart.dataModel[app.graph.chart.abscissa];
    var xLabel = chart.xData.label;
    var xUnit = (chart.xData.unit ? ' (' + chart.xData.unit + ')' : '');
    app.graph.chart.xLabel(chart, 'xLabel_' + app.simulation.recorders.indexOf(recorder), xLabel + xUnit)

    if (recorder.node.model == 'multimeter') {
        chart.yData = app.graph.chart.dataModel[$('#record_' + recorder.node.id).val()];
    } else if (recorder.node.model == 'spike_detector') {
        chart.yData = app.graph.chart.dataModel[recorder.node.psth.ordinate];
    } else {
        chart.yData = app.graph.chart.dataModel['V_m'];
    }
    var yLabel = (height / chart.yData.label.length) < 6 ? chart.yData.abbr : chart.yData.label;
    var yUnit = (chart.yData.unit ? ' (' + chart.yData.unit + ')' : '');
    app.graph.chart.yLabel(chart, 'yLabel_' + app.simulation.recorders.indexOf(recorder), yLabel + yUnit)

    chart.line
        .x((d, i) => chart.xScale(chart.data.x[i]))
        .y((d) => chart.yScale(d));

    chart.draw_line(recorder.node.series || 'stack')
    app.graph.chart.legend(chart, chart.data.legend, chart.data.c)

    chart.g.style('display', null)
}

chart.init = (reference, id, size) => {
    // console.log('Init line chart')

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

    app.graph.chart.xAxis(chart);
    app.graph.chart.yAxis(chart);
    app.graph.chart.onDrag(chart);
    app.graph.chart.onZoom(chart);

    chart.line = d3.line();
}

module.exports = chart
