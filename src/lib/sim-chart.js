"use strict"

var simChart = {
    trace: require(__dirname + '/simChart/trace'),
    rasterPlot: require(__dirname + '/simChart/raster-plot'),
    heatmap: require(__dirname + '/simChart/heatmap')
};

simChart.fromModel = {
    'voltmeter': 'trace',
    'multimeter': 'trace',
    'spike_detector': 'rasterPlot',
}

module.exports = simChart;
