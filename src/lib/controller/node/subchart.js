"use strict"

var nodeController = {};

nodeController.subchart = (node) => {
    if (node.element_type != 'recorder') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    var subchart = node.subchart || {};
    node.subchart = subchart;

    nodeElem.find('.subChart').append('<div class="subchart form-group hideOnDrawing"></div>')
    nodeElem.find('.subchart').append('<label for="subchart_' + node.id + '">Subchart</label>')
    nodeElem.find('.subchart').append('<select data-id="' + node.id + '" id="subchart_' + node.id + '" class="subchartView form-control"></select>')
    nodeElem.find('.subchartView').append('<option value="none" class="form-control">No chart</option>')
    nodeElem.find('.subchartView').append('<option value="bar" class="form-control">Bar chart</option>')
    if (node.model == 'spike_detector') {
        nodeElem.find('.subchartView').append('<option value="line" class="form-control">Line chart</option>')
    }
    nodeElem.find('.subchartView').val(subchart.view || 'none')
    nodeElem.find('.subchartView').on('change', function() {
        node.subchart = subchart;
        node.subchart.view = this.value;
        app.graph.chart.load()
        app.graph.chart.update()
    })

    if (node.model == 'spike_detector') {
        nodeElem.find('.subchart').append('<label for="subchart_' + node.id + '">Subchart data</label>')
        nodeElem.find('.subchart').append('<select data-id="' + node.id + '" id="subchart_' + node.id + '" class="subchartData form-control"></select>')
        nodeElem.find('.subchartData').append('<option value="psth" class="form-control">Peri-stimulus time histogram (PSTH)</option>')
        nodeElem.find('.subchartData').append('<option value="isi" class="form-control">Inter-spike interval (ISI)</option>')
        nodeElem.find('.subchartData').val(subchart.data || 'psth')
        nodeElem.find('.subchartData').on('change', function() {
            node.subchart = subchart;
            node.subchart.data = this.value;
            node.data_from = [this.value];
            app.graph.chart.load()
            app.graph.chart.update()
        })

        nodeElem.find('.subchart').append('<label for="psthOrdinate_' + node.id + '">Ordinate of PSTH</label>')
        nodeElem.find('.subchart').append('<select data-id="' + node.id + '" id="psthOrdinate_' + node.id + '" class="psthOrdinate record form-control"></select>')
        nodeElem.find('#psthOrdinate_' + node.id).append('<option value="spike_count" class="spike_count form-control">Spike count</option>')
        nodeElem.find('#psthOrdinate_' + node.id).append('<option value="rate" class="rate form-control">Firing rate [spikes/sec]</option>')
        nodeElem.find('#psthOrdinate_' + node.id).val(subchart.ordinate || 'spike_count')
        $('#psthOrdinate_' + node.id).on('change', function() {
            node.subchart = subchart;
            node.subchart.ordinate = this.value;
            var recorder = app.simulation.recorders.find(
                (recorder) => recorder.node.id == node.id
            )
            recorder.chart.update(recorder)
        })
    }

}

module.exports = nodeController;
