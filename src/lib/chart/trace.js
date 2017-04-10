"use strict"

var trace = {}

trace.update = function(recorder) {
    if (recorder.events.senders.length == 0) return

    var lineChart = trace.lineChart;
    if (document.getElementById('autoscale').checked) {
        lineChart.g.select('#clip').call(d3.zoom().transform, d3.zoomIdentity);
    }

    recorder.data = {
        n: recorder.senders.length
    }

    recorder.data.x = recorder.events.times.filter(function(d, i) {
        return recorder.events.senders[i] == recorder.senders[0]
    })

    if (recorder.node.model == 'multimeter') {
        var record_from_list = recorder.node.params.record_from.filter(function(rec) {
            // return recorder.node.record_from
            return rec.startsWith('V_m')
        })
    } else {
        var record_from_list = ['V_m']
    }

    recorder.data.senders = []
    recorder.data.recs = []
    var y = recorder.node.record_from.map(function(record_from, ridx) {
        return recorder.senders.map(function(s, i) {
            recorder.data.recs.push(ridx)
            recorder.data.senders.push(i)
            return recorder.events[record_from].filter(function(r, i) {
                return recorder.events.senders[i] == s
            })
        })
    })
    recorder.data.y = [].concat.apply([], y);

    var line_color = [];
    var legend = [];
    var legend_color = [];
    var colors = app.chart.colors();
    if (app.config.app().get('chart.color.group') == 'node') {
        app.data.links.filter(function(link) {
            return link.target == recorder.node.id
        }).map(function(link) {
            line_color.push(app.format.fillArray(colors[app.data.nodes[link.source].id % colors.length], app.data.nodes[link.source].ids.length * recorder.node.record_from.length))
            legend.push('Neuron')
            legend_color.push(colors[app.data.nodes[link.source].id % colors.length])
        })
        recorder.data.c = d3.merge(line_color)
        var ylabel = app.model.record_labels[$('#record_' + recorder.node.id).val()]
    } else if (app.config.app().get('chart.color.group') == 'recording') {
        recorder.data.recs.map(function(r) {
            line_color.push(colors[r])
        })
        recorder.node.record_from.map(function(r, i) {
            legend.push(app.model.record_labels[r].split(' ')[0])
            legend_color.push(colors[i])
        })
        recorder.data.c = line_color
    }

    var ylabel = app.model.record_labels[$('#record_' + recorder.node.id).val()]
    app.chart.yLabel(lineChart, ylabel)
    lineChart.update(recorder.data);
    app.chart.legend(lineChart, legend, legend_color)
}

trace.init = function(idx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').attr('height')) / app.simulation.recorders.length;
    trace.lineChart = require(__dirname + '/core/line-chart');
    delete require.cache[require.resolve(__dirname + '/core/line-chart')]
    trace.lineChart.init('#dataChart', {
        y: height * idx,
        height: height,
    });
}

module.exports = trace
