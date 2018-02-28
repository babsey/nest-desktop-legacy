"use strict"

const d3 = require("d3");

var chart = {
    data: {},
};

chart.format = d3.format(".2f");

chart.transition = d3.transition()
    .ease(d3.easeLinear);

chart.doTransition = () => !(
    app.simulation.running ||
    app.graph.dragging ||
    app.graph.chart.zooming ||
    app.resizing ||
    app.mouseover)

chart.xAxis = (subchart) => {
    subchart.xAxis = d3.axisBottom(subchart.xScale);
    subchart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis yaxis")
        .attr("transform", "translate(0," + subchart.height + ")")
        .style('font-size', '14px')
        .call(subchart.xAxis);
}

chart.yAxis = (subchart) => {
    subchart.yAxis = d3.axisLeft(subchart.yScale).ticks(3);
    subchart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis yaxis")
        .style('font-size', '14px')
        .attr("transform", "translate(0,0)")
        .call(subchart.yAxis);
}

chart.xLabel = (subchart) => {
    if (!('label' in subchart.axis.x)) return
    var id = 'xLabel_recorder' + subchart.recorder.idx + '_chart' + subchart.idx;
    var label = subchart.axis.x.label;
    var unit = subchart.axis.x.unit;
    if (!document.getElementById(id)) {
        subchart.g.append("text")
            .attr("id", id)
            .attr("class", "xlabel label")
            .attr("text-anchor", "middle")
            .attr("x", +subchart.width / 2)
            .attr("y", +subchart.height + 30)
            .text(app.format.axisLabel(label, unit));
    }

    subchart.g.select("#" + id)
        .text(app.format.axisLabel(label, unit));
}

chart.yLabel = (subchart) => {
    if (!('label' in subchart.axis.y)) return
    var id = 'yLabel_recorder' + subchart.recorder.idx + '_chart' + subchart.idx;
    var n = subchart.data.n || 1;
    if (subchart.axis.y.abbr) {
        var label = (subchart.height / n / subchart.axis.y.label.length) > 7 ? subchart.axis.y.label : subchart.axis.y.abbr;
    } else {
        var label = subchart.axis.y.label;
    }
    var unit = subchart.axis.y.unit;
    if (!document.getElementById(id)) {
        subchart.g.append("text")
            .attr("id", id)
            .attr("class", "ylabel label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end")
            .text(app.format.axisLabel(label, unit));
    }

    subchart.g.select("#" + id)
        .attr("x", -1. * +subchart.yScale.range()[1])
        .text(app.format.axisLabel(label, unit));
}

chart.legend = (subchart, data, color) => {
    subchart.g.selectAll('.legends').remove()
    if (!data) return

    var width = d3.max(data.map((d) => d.length)) * 7;
    var legend = subchart.g.append('g')
        .attr('class', 'legends')
        .selectAll('.legend')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', subchart.width - width)
        .attr('y', (d, i) => i * 20 - 5)
        .attr('width', width)
        .attr('height', 20)
        .style('fill', 'white');

    legend.append('rect')
        .attr('x', subchart.width - width)
        .attr('y', (d, i) => i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', (d, i) => color[i]);

    legend.append('text')
        .attr('x', subchart.width - width + 12)
        .attr('y', (d, i) => (i * 20) + 9)
        .text((d) => d);
}

chart.onDrag = (subchart) => {
    var drag = d3.drag()
        .on("start", () => {
            app.graph.dragging = true;
            $('#point').empty();
            if (subchart.focus) {
                subchart.focus.attr('transform', 'translate(-1000,-1000)');
            }
        })
        .on("drag", () => {
            $('#autoscale').prop('checked', false)
            var xlim0 = chart.xScale.domain();
            var xx = xlim0[1] - xlim0[0];
            var xs = chart.xScale.range();
            var dx = d3.event.dx * xx / (xs[1] - xs[0]);
            chart.xScale.domain([xlim0[0] - dx, xlim0[1] - dx])
            chart.update()
        })
        .on("end", () => {
            app.graph.dragging = false;
        })
    subchart.g.select('#clip')
        .call(drag);
}

chart.onZoom = (subchart) => {
    var zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", () => {
            chart.zooming = true;
            $('#point').empty();
            if (subchart.focus) {
                subchart.focus.attr('transform', 'translate(-1000,-1000)');
            }
        })
        .on("zoom", () => {
            $('#autoscale').prop('checked', false)
            var xlim0 = chart.xScale.domain();
            // var xlim0 = [data.kernel.time - data.sim_time, data.kernel.time];
            var xx = (xlim0[0] + xlim0[1]) / 2;
            var k = d3.event.transform.k;
            chart.xScale.domain([xx - xx / k, xx + xx / k])
            chart.update()
        })
        .on("end", () => {
            chart.zooming = false;
        })
    subchart.g.select('#clip')
        .call(zoom);
}

chart.axesUpdate = (subchart) => {
    app.graph.chart.xLabel(subchart)
    app.graph.chart.yLabel(subchart)
    if (chart.doTransition()) {
        subchart.g.select('#xaxis')
            .transition(subchart.transition)
            .call(subchart.xAxis);
        subchart.g.select('#yaxis')
            .transition(subchart.transition)
            .call(subchart.yAxis);
    } else {
        subchart.g.select('#xaxis')
            .call(subchart.xAxis);
        subchart.g.select('#yaxis')
            .call(subchart.yAxis);
    }
}

chart.scaling = () => {
    if ($('#autoscale').prop('checked')) {
        if (app.simulation.running) {
            chart.xScale.domain([d3.max([0, app.data.kernel.time - 1000.]), app.data.kernel.time])
        } else {
            chart.xScale.domain(d3.extent(chart.data.times)).nice()
        }
    }
}


chart.dataUpdate = () => {
    app.message.log('Update chart data')
    app.simulation.recorders.map((recorder) => {
        if (!recorder.node.model) return
        recorder.data = recorder.senders.map((sender, sidx) => {
            var data = {};
            Object.keys(recorder.events).map((d) => {
                data[d] = recorder.events[d].filter(
                    (d, i) => recorder.events.senders[i] == sender
                )
                data[d].idx = sidx;
            })
            var links = app.data.links.filter(
                (link) => link.target == recorder.node.id && app.data.nodes[link.source].ids.indexOf(sender) != -1
            )
            if (links.length == 1) {
                var link = links[0]
                data.color = app.graph.colors()[app.data.nodes[link.source].id]
            } else {
                data.color = app.graph.colors()[sidx]
            }
            return data
        })
        // recorder.senders.map((sender, sidx) => {
        //     app.simulation.stimulators.map((stimulator) => {
        //         Object.keys(stimulator.events).map((ekey) => {
        //             recorder.data[sidx][ekey] = stimulator.events[ekey]
        //         })
        //     })
        // })
    })
}

chart.update = () => {
    app.message.log('Update chart')
    chart.scaling()
    app.simulation.recorders.map((recorder) => {
        recorder.chart.update(recorder)
    })
}

chart.load = () => {
    var fromOutputNode = {
        'voltmeter': 'trace',
        'multimeter': 'trace',
        'spike_detector': 'raster-plot',
    };

    $('#chart').empty()
    app.simulation.recorders.map((recorder, idx) => {
        if (!recorder.node.model) return
        recorder.idx = idx;
        var recorderChart = recorder.node.chart || fromOutputNode[recorder.node.model]
        recorder.chart = require('./' + recorderChart)
        recorder.chart.init(recorder)
        delete require.cache[require.resolve('./' + recorderChart)]
    })
}

chart.init = () => {
    app.message.log('Initialize chart')
    chart.zooming = false;
    chart.drawing = false;

    var margin = {
        top: 50,
        right: 0,
        bottom: 10,
        left: 60
    };

    chart.width = app.graph.width - margin.left - margin.right
    chart.height = app.graph.height - margin.top - margin.bottom
    chart.dataModel = app.config.nest('data');

    d3.select('#chart')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (chart.xScale) {
        var xScaleDomain = chart.xScale.domain()
    }
    chart.xScale = d3.scaleLinear();
    chart.xScale.range([0, chart.width])
    if (xScaleDomain) {
        chart.xScale.domain(xScaleDomain)
    }

    $('#autoscale').off('click').on('click', chart.update)

}

module.exports = chart;
