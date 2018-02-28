"use strict"

const connController = require('./connection');
const synController = require('./synapse');

var nodeController = {
    amplitude: require('./node/amplitude'),
    nbins: require('./node/nbins').nbins,
    npop: require('./node/npop').npop,
    params: require('./node/params').params,
    rec_time: require('./node/rec_time').rec_time,
    record_from: require('./node/record_from').record_from,
    series: require('./node/series').series,
    spike_dtime: require('./node/spike_dtime').spike_dtime,
    stim_time: require('./node/stim_time').stim_time,
    subchart: require('./node/subchart').subchart,
}

nodeController.update = (node) => {
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    nodeElem.find('.nodeSlider').empty()
    nodeController.npop(node)
    nodeController.stim_time(node)
    nodeController.spike_dtime(node)
    nodeController.amplitude.init(node)
    nodeController.rec_time(node)
    nodeController.params(node)
    nodeElem.find('.selection').empty()
    nodeController.record_from(node)
    nodeController.series(node)
    nodeElem.find('.subChart').empty()
    nodeController.nbins(node)
    nodeController.subchart(node)
    app.slider.update_nodeSlider(node);
}

nodeController.init = (node) => {
    $('#nodes .controller').append(app.renderer.node.controller(node))
    var nodeElem = $('#nodes .node[data-id=' + node.id + ']');
    var modelDefaults = app.config.nest(node.element_type);
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        nodeElem.find('.modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
    }
    nodeElem.find('option#' + node.model).prop('selected', true);
    nodeElem.find('.modelSelect').toggleClass('disabled', node.disabled || false)
    nodeElem.find('.glyphicon-remove').toggle(node.disabled || false)
    nodeElem.find('.glyphicon-ok').toggle(!node.disabled && true)
    nodeElem.find('.modelSelect').on('change', function(d, i) {
        node.model = this.value;
        node.params = {};

        app.controller.simulation.init()
        app.model.node_selected(node)
        nodeController.update(node)

        if (app.graph.networkLayout.drawing) {
            app.graph.networkLayout.update()
            return
        }

        app.data.links.filter(
            (link) => link.target == node.id
        ).map((link) => {
            connController.update(link)
            synController.update(link)
        })

        app.simulation.reload()
    })

    nodeElem.find('.disableNode').on('click', () => {
        app.data.kernel.time = 0.0 // Reset simulation
        node.disabled = !node.disabled;
        var disabled = node.disabled || false
        app.simulation.reload()
    })
    if (node.disabled) return

    $('#nodeSpy .nav').append(app.renderer.node.spy(node))
    $('#nodeSpy').find('.node[data-id=' + node.id + ']').on('click', function(e) {
        if (app.graph.networkLayout.drawing) return
        app.selected_node = app.selected_node == node ? null : node;
        app.selected_link = null;
        app.graph.networkLayout.update()
        app.controller.update()
    })
    if (!node.model) return
    nodeController.update(node)
}

module.exports = nodeController;
