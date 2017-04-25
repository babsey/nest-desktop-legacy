"use strict"

//
// Line chart
//

const colorbrewer = require('colorbrewer');
const d3 = require("d3");

var chart = {
    data: {}
};

function _draw_line(classname, series) {

    var lines = chart.g.select('#clip')
        .selectAll('.' + classname)
        .data(chart.data.y);

    lines.attr("style", function(d, i) {
        return 'stroke:' + (app.selected_node ? chart.data.c[i] : '')
    })

    var subplot = function(i) {
        return -1 * (chart.data.n - (i % chart.data.n) - 1) * chart.height / chart.data.n
    };
    var color = function(i) {
        return app.config.app().chart.color ? chart.data.c[i] : ''
    };
    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    if (transition) {
        lines.transition(app.chart.transition)
            .attr('height', chart.height / chart.data.n)
            .attr("transform", function(d, i) {
                if (series == 'overlap') return
                return "translate(0," + subplot(i) + ")"
            })
            .attr("style", function(d, i) {
                return 'stroke:' + color(i)
            })
            .attr("d", chart.line);

        lines.enter()
            .append("path")
            .attr('height', chart.height / chart.data.n)
            .attr("transform", function(d, i) {
                if (series == 'overlap') return
                return "translate(0," + subplot(i) + ")"
            })
            .attr("class", function(d, i) {
                return classname + ' line_' + i
            })
            .on('mouseover', function(d, i) {
                chart.g.selectAll('#clip')
                    .classed('active', true);
                chart.g.selectAll('.aline.line_' + i)
                    .classed('active', true);
            })
            .on('mouseout', function(d, i) {
                chart.g.selectAll('#clip')
                    .classed('active', false)
                chart.g.selectAll('#clip path')
                    .classed('active', false);
            })
            .attr("style", function() {
                return 'zscore:' + (classname == 'aline' ? 1 : -1000)
            })
            .attr("style", function(d, i) {
                return 'stroke:' + color(i)
            })
            .transition(app.chart.transition)
            .attr("d", function(d) {
                return chart.line(d)
            });
    } else {
        lines.attr('height', chart.height / chart.data.n)
            .attr("transform", function(d, i) {
                if (series == 'overlap') return
                return "translate(0," + subplot(i) + ")"
            })
            .attr("style", function(d, i) {
                return 'stroke:' + color(i)
            })
            .attr("d", chart.line)

        lines.enter()
            .append("path")
            .attr('height', chart.height / chart.data.n)
            .attr("transform", function(d, i) {
                if (series == 'overlap') return
                return "translate(0," + subplot(i) + ")"
            })
            .attr("class", function(d, i) {
                return classname + ' line_' + i
            })
            .on('mouseover', function(d, i) {
                chart.g.selectAll('#clip')
                    .classed('active', true);
                chart.g.selectAll('.aline.line_' + i)
                    .classed('active', true);
            })
            .on('mouseout', function(d, i) {
                chart.g.selectAll('#clip')
                    .classed('active', false)
                chart.g.selectAll('#clip path')
                    .classed('active', false);
            })
            .attr("style", function() {
                return 'zscore:' + (classname == 'aline' ? 1 : -1000)
            })
            .attr("style", function(d, i) {
                return 'stroke:' + color(i)
            })
            .attr("d", chart.line);
    }

    lines.exit()
        .remove();
}

chart.update = function(recorder) {
    chart.xScale.domain(app.chart.xScale.domain())
    chart.data.y = [].concat.apply([], recorder.data.map(function(d) {
        return recorder.node.record_from.map(function(r) {
            return d[r].filter(function(d, i) {
                return app.chart.data[app.chart.abscissa][i] > app.chart.xScale.domain()[0] && app.chart.data[app.chart.abscissa][i] <= app.chart.xScale.domain()[1]
            })
        })
    }))
    chart.data.x = recorder.data.map(function(d) {
        return d[app.chart.abscissa].filter(function(dd) {
            return dd > app.chart.xScale.domain()[0] && dd <= app.chart.xScale.domain()[1]
        })
    })[0]
    if (recorder.node.record_from.length == 1) {
        chart.data.c = [].concat.apply([], app.data.links.filter(function(link) {
            return link.target == recorder.node.id
        }).map(function(link, idx) {
            return app.format.fillArray(recorder.data[idx].color, (app.data.nodes[link.source].n || 1))
        }))
    } else if (recorder.node.record_from.length > 1) {
        var colors = colorbrewer['Dark2'][3]
        chart.data.c = recorder.node.record_from.map(function(r, i) {
            return colors[i]
        })
        chart.data.legend = recorder.node.record_from.map(function(r, i) {
            return app.model.record_legends[r]
        })
    }
    chart.data.n = recorder.node.series == 'overlap' ? 1 : recorder.senders.length

    chart.g.attr('height', recorder.node.series == "overlap" ? chart.height : chart.height / recorder.data.length)
    chart.xScale.range([0, +chart.g.attr('width')])
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.domain(app.chart.xScale.domain())
    chart.yScale.domain(d3.extent([].concat.apply([], chart.data.y)))


    var transition = !(app.simulation.running || app.chart.dragging || app.chart.zooming || app.chart.resizing || app.mouseover)
    app.chart.axesUpdate(chart, transition)

    app.chart.xLabel(chart, 'xLabel_' + app.simulation.recorders.indexOf(recorder), (app.model.record_labels[app.chart.abscissa] || app.chart.abscissa))
    var ylabel = app.model.record_labels[$('#record_' + recorder.node.id).val() || recorder.node.record_from[0]]
    app.chart.yLabel(chart, 'yLabel_' + app.simulation.recorders.indexOf(recorder), ylabel)

    chart.line.x(function(d, i) {
        return chart.xScale(chart.data.x[i]);
    }).y(function(d) {
        return chart.yScale(d);
    });

    _draw_line('aline', recorder.node.series)
    _draw_line('bline', recorder.node.series)

    if (chart.data.legend) {
        app.chart.legend(chart, chart.data.legend, chart.data.c)
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

    chart.g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) + ")");

    var clip = chart.g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    app.chart.xAxis(chart);
    app.chart.yAxis(chart);
    app.chart.onDrag(chart);
    app.chart.onZoom(chart);

    chart.line = d3.line();
}

module.exports = chart
