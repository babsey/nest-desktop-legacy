"use strict"

var nodeController = {};

nodeController.subChartOrdinate = (node, ordinates) => {
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    var subchart = node.subchart || {view:'none', nbins:100};
    node.subchart = subchart;
    node.subchart.ordinate = ordinates[0];

    var subchartElem = nodeElem.find('.subchart');
    var subchartOrdinate = subchartElem.find('.subchart-ordinate');

    subchartOrdinate.find('.dropdown-menu').empty()
    ordinates.map((ordinate) => {
        var label = app.graph.chart.dataModel[ordinate].label;
        subchartOrdinate.find('.dropdown-menu').append('<li><a href="#" data-value="' + ordinate + '">' + label + '</a></li>')
    })
    subchartOrdinate.find('button').html(subchartOrdinate.find('.dropdown-menu').find('a[data-value="' + subchart.ordinate + '"]').html())

    subchartOrdinate.find('.dropdown-menu a').on('click', (d) => {
        node.subchart = subchart;
        subchartOrdinate.find('button').html($(d.currentTarget).html())
        node.subchart.ordinate = $(d.currentTarget).data('value');
        var recorder = app.simulation.recorders.find(
            (recorder) => recorder.node.id == node.id
        )
        recorder.chart.update(recorder)
    })
    subchartOrdinate.toggle(node.subchart.view != 'none')
}

nodeController.subchart = (node) => {
    if (node.element_type != 'recorder') return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    var subchart = node.subchart || {view:'none', nbins:100};
    node.subchart = subchart;

    var subchartElem = nodeElem.find('.subchart');
    var subchartView = subchartElem.find('.subchart-view');
    subchartView.find('.dropdown-menu').empty()
    if (node.model == 'spike_detector') {
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-value="none" data-view="none">No subchart</a></li>')
        subchartView.find('.dropdown-menu').append('<li class="divider"></li>')
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-value="psth" data-view="bar" title="Peri-stimulus time histogram">PSTH</a></li>')
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-value="psth" data-view="line" title="Peri-stimulus time histogram">PSTH, grouped by nodes</a></li>')
        subchartView.find('.dropdown-menu').append('<li class="divider"></li>')
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-value="isi" data-view="bar" title="Inter-spike interval">ISI</a></li>')
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-value="isi" data-view="line" title="Inter-spike interval">ISI, grouped by nodes</a></li>')
        subchartView.find('button').html(subchartView.find('.dropdown-menu').find('a[data-value="' + subchart.data + '"][data-view="' + subchart.view + '"]').html())
        subchartView.find('.dropdown-menu a').on('click', (d) => {
            node.subchart = subchart;
            subchartView.find('button').html($(d.currentTarget).html())
            node.subchart.data = $(d.currentTarget).data('value');
            node.subchart.view = $(d.currentTarget).data('view');
            node.data_from = [node.subchart.data];
            nodeController.subChartOrdinate(node, node.subchart.data == 'psth' ? ['spike_count', 'rate'] : ['count', 'count_normed'])
            subchartElem.find('.slider').toggle(node.subchart.data != 'none')
            app.graph.chart.load()
            app.graph.chart.update()
        })
        nodeController.subChartOrdinate(node, node.subchart.data == 'psth' ? ['spike_count', 'rate'] : ['count', 'count_normed'])


        //
        // subchartOrdinate.find('.dropdown-menu').append('<li><a href="#" data-value="spike_count">Spike count</a></li>')
        // subchartOrdinate.find('.dropdown-menu').append('<li><a href="#" data-value="rate">Firing rate</a></li>')
        // subchartOrdinate.find('button').html(subchartOrdinate.find('.dropdown-menu').find('a[data-value="' + (subchart.ordinate || 'spike_count') + '"]').html())
        // subchartOrdinate.find('.dropdown-menu a').on('click', (d) => {
        //     node.subchart = subchart;
        //     subchartOrdinate.find('button').html($(d.currentTarget).html())
        //     node.subchart.ordinate = $(d.currentTarget).data('value');
        //     var recorder = app.simulation.recorders.find(
        //         (recorder) => recorder.node.id == node.id
        //     )
        //     recorder.chart.update(recorder)
        // })
    } else {
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-view="none">No subchart</a></li>')
        subchartView.find('.dropdown-menu').append('<li class="divider"></li>')
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-view="line" title="Averaged values">Averaged values</a></li>')
        subchartView.find('.dropdown-menu').append('<li><a href="#" data-view="bar" title="Histogram of values">Histogram of values</a></li>')
        subchartView.find('button').html(subchartView.find('.dropdown-menu').find('a[data-view="' + subchart.view + '"]').html())
        subchartView.find('.dropdown-menu a').on('click', (d) => {
            node.subchart = subchart;
            subchartView.find('button').html($(d.currentTarget).html())
            node.subchart.view = $(d.currentTarget).data('view');
            subchartElem.find('.slider').toggle(node.subchart.data != 'none')
            app.graph.chart.load()
            app.graph.chart.update()
        })
    }
}

module.exports = nodeController;
