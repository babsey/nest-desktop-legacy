"use strict"

var nodeController = {};

nodeController.record_from = (node) => {
    if (node.element_type != 'recorder') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    if (node.model == 'multimeter') {
        nodeElem.find('.selection').append('<div class="recSelect form-group hideOnDrawing"></div>')
        nodeElem.find('.recSelect').append('<label for="record_' + node.id + '">Record from</label>')
        nodeElem.find('.recSelect').append('<select data-id="' + node.id + '" id="record_' + node.id + '" class="record form-control"></select>')
        app.model.get_recordables_list(node)
    }
    $('#record_' + node.id).on('change', function() {
        var recorder = app.simulation.recorders.filter(
            (recorder) => recorder.node.id == node.id)[0];
        var rec = this.value;
        recorder.node.data_from = recorder.node.params.record_from.filter(
            (record_from) => record_from.indexOf(rec) != -1)
        recorder.data.senders = []
        recorder.data.recs = []
        var y = recorder.node.data_from.map(
            (d, ridx) => recorder.senders.map(
                (s, i) => {
                    recorder.data.recs.push(ridx)
                    recorder.data.senders.push(i)
                    return recorder.events[d].filter(
                        (r, i) => recorder.events.senders[i] == s
                    )
                })
        )
        recorder.data.y = [].concat.apply([], y);

        if ($('#autoscale').prop('checked')) {
            recorder.chart.lineChart.yScale.domain(d3.extent([].concat.apply([], recorder.data.y)))
        }
        app.graph.update();
    })
}

module.exports = nodeController;
