"use strict"

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

var simChart = {
    trace: require(__dirname + '/simChart/trace'),
    rasterPlot: require(__dirname + '/simChart/raster-plot'),
    heatmap: require(__dirname + '/simChart/heatmap'),
    networkLayout: require(__dirname + '/simChart/network-layout')
};

simChart.fromModel = {
    'voltmeter': 'trace',
    'multimeter': 'trace',
    'spike_detector': 'rasterPlot',
}

simChart.colors = d3.schemeCategory10;
// simChart.colors = d3.schemeCategory20;
// simChart.colors = colorbrewer.Paired[12];
// simChart.colors = colorbrewer.Dark2[8];

simChart.init = function() {
    $('#chart').attr('width', window.innerWidth - 350).attr('height', window.innerHeight - 50)
    simChart.xScale = d3.scaleLinear();
    simChart.xScale.range([0, (+window.innerWidth - 350)])

    var outputs = app.data.nodes.filter(function(node) {
        return node.type == 'output'
    })

    outputs.map(function(output, idx) {
        simChart[output.chart || simChart.fromModel[output.model]].init(output, outputs.length, idx)
    })
}

simChart.update = function() {
    if (document.getElementById('autoscale').checked) {
        simChart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
    }

    var outputs = app.data.nodes.filter(function(node) {
        return node.type == 'output'
    })

    outputs.map(function(output, idx) {
        simChart[output.chart || simChart.fromModel[output.model]].update(output)
    })
}

module.exports = simChart;
