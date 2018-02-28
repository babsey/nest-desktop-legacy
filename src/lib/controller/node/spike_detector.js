"use strict"

var nodeController = {};

nodeController.spike_detector = (node) => {
    if (node.model != 'spike_detector') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    var subchart = node.subchart || {};

    nodeElem.find('.selection').append('<div class="subchart form-group hideOnDrawing"></div>')
    nodeElem.find('.subchart').append('<label for="subchart_' + node.id + '">Subchart</label>')
    nodeElem.find('.subchart').append('<select data-id="' + node.id + '" id="subchart_' + node.id + '" class="subchartView form-control"></select>')
    nodeElem.find('.subchartView').append('<option value="none" class="form-control">No chart</option>')
    nodeElem.find('.subchartView').append('<option value="bar" class="form-control">Bar chart</option>')
    nodeElem.find('.subchartView').append('<option value="line" class="form-control">Line chart</option>')
    nodeElem.find('.subchartView').val(subchart.view || 'none')
    nodeElem.find('.subchartView').on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id
        )
        recorder.node.subchart = subchart;
        recorder.node.subchart.view = this.value;
        recorder.node.subchart.data = recorder.node.subchart.data || 'psth';
        app.graph.chart.load()
        app.graph.chart.update()
    })

    nodeElem.find('.subchart').append('<label for="subchart_' + node.id + '">Subchart data</label>')
    nodeElem.find('.subchart').append('<select data-id="' + node.id + '" id="subchart_' + node.id + '" class="subchartData form-control"></select>')
    nodeElem.find('.subchartData').append('<option value="psth" class="form-control">Peri-stimulus time histogram (PSTH)</option>')
    nodeElem.find('.subchartData').append('<option value="isi" class="form-control">Inter-spike interval (ISI)</option>')
    nodeElem.find('.subchartData').val(subchart.data || 'psth')
    nodeElem.find('.subchartData').on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id
        )
        recorder.node.subchart = subchart;
        recorder.node.subchart.data = this.value;
        recorder.node.data_from = [this.value];
        app.graph.chart.load()
        app.graph.chart.update()
    })

    nodeElem.find('.subchart').append('<label for="psthOrdinate_' + node.id + '">Ordinate of PSTH</label>')
    nodeElem.find('.subchart').append('<select data-id="' + node.id + '" id="psthOrdinate_' + node.id + '" class="psthOrdinate record form-control"></select>')
    nodeElem.find('#psthOrdinate_' + node.id).append('<option value="spike_count" class="spike_count form-control">Spike count</option>')
    nodeElem.find('#psthOrdinate_' + node.id).append('<option value="rate" class="rate form-control">Firing rate [spikes/sec]</option>')
    nodeElem.find('#psthOrdinate_' + node.id).val(subchart.ordinate || 'count')
    $('#psthOrdinate_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id
        )
        recorder.node.subchart = subchart;
        recorder.node.subchart.ordinate = this.value;
        recorder.chart.update(recorder)
    })

}

module.exports = nodeController;
