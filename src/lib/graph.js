"use strict"

const d3 = require("d3");
const colorbrewer = require('colorbrewer');

var graph = {
    chart: require('./graph/chart'),
    networkLayout: require('./graph/network-layout'),
};

var colors = d3.schemeCategory10;
// var colors = colorbrewer.RdYlGn;
// var keys = Object.keys(colors);
// var colors = colors[keys[keys.length - 1]]

graph.colors = (id) => {
    if (id != undefined) {
        return colors[id % colors.length]
    }
    if (app.data == undefined) return colors
    return app.data.nodes.map(
        (d) => (d.color || colors[d.id % colors.length])
    )
}

graph.update = () => {
    app.message.log('Update graph')
    if (networkLayout.drawing || chart.drawing) return
    graph.chart.dataUpdate()
    graph.chart.update()
    graph.networkLayout.update()
}

graph.init = () => {
    graph.dragging = false;

    app.message.log('Initialize chart')

    var margin = {
        top: 0,
        right: 380,
        bottom: 0,
        left: 0
    }

    graph.width = window.innerWidth - margin.left - margin.right;
    graph.height = window.innerHeight - margin.top - margin.bottom;

    $('#graph svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)

    graph.chart.init()
    graph.networkLayout.init()

    var resizeTimer;
    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            app.resizing = true;
            graph.init();
            graph.chart.load();
            graph.update();
            app.controller.update();
            app.resizing = false;
        }, 10);
    });
}

module.exports = graph;
