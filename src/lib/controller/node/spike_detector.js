"use strict"

var nodeController = {};

nodeController.spike_detector = (node) => {
    if (node.model != 'spike_detector') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    nodeElem.find('.selection').append('<div class="psthSelect form-group hideOnDrawing"></div>')
    if (!node.psth) {
        node.psth = {
            chart: 'bar',
            ordinate: 'count',
        };
    }

    nodeElem.find('.psthSelect').append('<label for="psthOrdinate_' + node.id + '">Ordinate of PSTH</label>')
    nodeElem.find('.psthSelect').append('<select data-id="' + node.id + '" id="psthOrdinate_' + node.id + '" class="record form-control"></select>')
    nodeElem.find('#psthOrdinate_' + node.id).append('<option value="count" class="count form-control">Spike count</option>')
    nodeElem.find('#psthOrdinate_' + node.id).append('<option value="rate" class="rate form-control">Firing rate [spikes/sec]</option>')
    nodeElem.find('#psthOrdinate_' + node.id).val(node.psth.ordinate || 'count')
    $('#psthOrdinate_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id)
        var ordinate = this.value
        recorder.node.psth.ordinate = ordinate;
        recorder.chart.update(recorder)
    })

    nodeElem.find('.psthSelect').append('<label for="psth_' + node.id + '">Chart view for PSTH</label>')
    nodeElem.find('.psthSelect').append('<select data-id="' + node.id + '" id="psthChart_' + node.id + '" class="psth form-control"></select>')
    nodeElem.find('#psthChart_' + node.id).append('<option value="bar" class="form-control">Bar chart</option>')
    nodeElem.find('#psthChart_' + node.id).append('<option value="line" class="form-control">Line chart</option>')
    nodeElem.find('#psthChart_' + node.id).val(node.psth.chart || 'bar')
    $('#psthChart_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id
        )
        recorder.node.psth.chart = this.value;
        recorder.chart.update(recorder)
    })

}

module.exports = nodeController;
