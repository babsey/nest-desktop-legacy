"use strict"

var nodeController = {};

nodeController.record_from = (node) => {
    if (node.model != 'multimeter') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    nodeElem.find('.dataSelect').append('<div class="hideOnDrawing recSelect"></div>')
    nodeElem.find('.dataSelect .recSelect').append('<label>Record from</label>')
    nodeElem.find('.dataSelect .recSelect').append('<div class="btn-group dropdown record select"><button role="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown"></button><ul class="dropdown-menu"></ul></div>')
    app.model.get_recordables_list(node)
    nodeElem.find('.dataSelect .recSelect .dropdown-menu a').on('click', (d) => {
        var recorder = app.simulation.recorders.filter(
            (recorder) => recorder.node.id == node.id)[0];
            var rec = $(d.currentTarget).data('value');
        var rec = $(d.currentTarget).data('value');
        nodeElem.find('.recSelect button').data('id', rec)
        nodeElem.find('.recSelect button').html($(d.currentTarget).html())
        console.log(rec, recorder.node.params.record_from)
        recorder.node.data_from = recorder.node.params.record_from.filter(
            (record_from) => record_from.indexOf(rec) != -1);
        recorder.data.senders = [];
        recorder.data.recs = [];
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
        app.graph.update();
    })
}

module.exports = nodeController;
