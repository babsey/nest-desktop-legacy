"use strict"

var nodeController = {};

nodeController.spike_detector = (node) => {
    if (node.model != 'spike_detector') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    node.record_from = node.record_from || ['count'];
    node.PSTHchart = node.PSTHchart || 'bar';
    nodeElem.find('.selection').append('<div class="psthSelect form-group hideOnDrawing"></div>')
    nodeElem.find('.psthSelect').append('<label for="psth_' + node.id + '">Chart view for PSTH</label>')
    nodeElem.find('.psthSelect').append('<select data-id="' + node.id + '" id="psthChart_' + node.id + '" class="psth form-control"></select>')
    nodeElem.find('#psthChart_' + node.id).append('<option value="bar" class="form-control">Bar chart</option>')
    nodeElem.find('#psthChart_' + node.id).append('<option value="line" class="form-control">Line chart</option>')
    $('#psthChart_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id
        )
        recorder.node.psth = this.value;
        recorder.chart.update(recorder)
    })
    nodeElem.find('#psthChart_' + node.id).val(node.PSTHchart)

    nodeElem.find('.psthSelect').append('<label for="psthOrdinate_' + node.id + '">Ordinate of PSTH</label>')
    nodeElem.find('.psthSelect').append('<select data-id="' + node.id + '" id="psthOrdinate_' + node.id + '" class="record form-control"></select>')
    nodeElem.find('#psthOrdinate_' + node.id).append('<option value="count" class="count form-control">Spike counts</option>')
    nodeElem.find('#psthOrdinate_' + node.id).append('<option value="rate" class="rate form-control">Firing rate [spikes/sec]</option>')
    $('#psthOrdinate_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id)
        recorder.node.record_from = [this.value];
        recorder.chart.update(recorder)
    })
    nodeElem.find('#psthOrdinate_' + node.id).val(node.record_from[0])
}

module.exports = nodeController;
