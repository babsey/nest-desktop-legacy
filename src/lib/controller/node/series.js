"use strict"

var nodeController = {};

nodeController.series = (node) => {
    if (['voltmeter', 'multimeter'].indexOf(node.model) == -1) return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    node.series = node.series || 'stack';
    nodeElem.find('.selection').append('<div class="seriesSelect form-group hideOnDrawing"></div>')
    nodeElem.find('.seriesSelect').append('<label for="series_' + node.id + '">Data series</label>')
    nodeElem.find('.seriesSelect').append('<select data-id="' + node.id + '" id="series_' + node.id + '" class="series form-control"></select>')
    nodeElem.find('#series_' + node.id).append('<option value="overlap">Overlap</option>')
    nodeElem.find('#series_' + node.id).append('<option value="stack">Stack</option>')
    nodeElem.find('#series_' + node.id).val(node.series)
    $('#series_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id)
        recorder.node.series = this.value;
        recorder.chart.update(recorder)
    })
}

module.exports = nodeController;
