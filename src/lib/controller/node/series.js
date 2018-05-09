"use strict"

var nodeController = {};

nodeController.series = (node) => {
    if (['voltmeter', 'multimeter'].indexOf(node.model) == -1) return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    node.series = node.series || 'stack';
    nodeElem.find('.dataSelect').append('<div class="seriesSelect hideOnDrawing"></div>')
    nodeElem.find('.dataSelect .seriesSelect').append('<label>Data series</label>')
    nodeElem.find('.dataSelect .seriesSelect').append('<div class="btn-group series select"><button role="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown"></button><ul class="dropdown-menu"><li><a href="#" data-value="overlap">Overlap</a></li><li><a href="#" data-value="stack">Stack</a></li></ul></div>')
    nodeElem.find('.dataSelect .seriesSelect button').html(app.format.capitalizeFirstLetter(node.series))
    nodeElem.find('.seriesSelect .dropdown-menu a').on('click', (d) => {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id)
        var series = $(d.currentTarget).data('value');
        nodeElem.find('.dataSelect .seriesSelect button').html($(d.currentTarget).html());
        recorder.node.series = series;
        recorder.chart.update(recorder)
    })
}

module.exports = nodeController;
