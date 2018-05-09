"use strict"

const math = require('mathjs');
const numeric = require('numeric');

const connController = require('./connection');
const synController = require('./synapse');
const amplitude = require('./node/amplitude');

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
    if (node.disabled) return
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');
    nodeElem.find('.nodeSlider').empty()
    nodeController.npop(node)
    nodeController.stim_time(node)
    nodeController.spike_dtime(node)
    nodeController.amplitude.init(node)
    nodeController.rec_time(node)
    nodeController.params(node)
    nodeElem.find('.dataSelect').empty()
    nodeController.record_from(node)
    nodeController.series(node)
    nodeController.subchart(node)
    nodeController.nbins(node)
    app.slider.update_nodeSlider(node);
}

nodeController.reset = (node) => {
    node.params = {};

    app.controller.simulation.init()
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

    if (node.model == 'spike_generator') {
        var nodeDefaults = app.config.nest('node');
        node.spike_dtime = node.spike_dtime || nodeDefaults.spike_dtime.value;
        node.spike_weight = node.spike_weight || nodeDefaults.spike_weight.value;
        node.params.spike_times = math.range(node.spike_dtime, app.data.sim_time, node.spike_dtime)._data;
        node.params.spike_weights = numeric.rep([node.params.spike_times.length], node.spike_weight);
    } else if (node.model == 'step_current_generator') {
        amplitude.update(node)
    }
}

nodeController.init = (node) => {
    $('#nodes .controller').append(app.renderer.node.controller(node))
    var nodeElem = $('#nodes .node[data-id=' + node.id + ']');
    var modelDefaults = app.config.nest(node.element_type);
    for (var midx in modelDefaults) {
        if (model && node.element_type == 'neuron') {
            if (model.id.slice(0,3) != modelDefaults[midx].id.slice(0,3)) {
                nodeElem.find('.nodeSelect .dropdown-menu').append('<li class="divider"></li>')
            }
        }
        var model = modelDefaults[midx];
        nodeElem.find('.nodeSelect .dropdown-menu').append('<li><a href="#" data-model="' + model.id + '" data-label="' + model.label +'">' + model.label + '</a></li>')
        if (model.id == node.model)
            nodeElem.find('.modelSelect .name').html(model.label);
    }
    nodeElem.find('.modelSelect button').toggleClass('disabled', node.disabled || false)
    nodeElem.find('.modelSelect .dropdown-menu a').on('click', (d, i) => {
        var modelElem = $(d.currentTarget)
        node.model = modelElem.data('model');
        nodeController.reset(node)
        app.simulation.reload()
    })

    nodeElem.find('.disableNode').on('click', () => {
        app.data.kernel.time = 0.0 // Reset simulation
        node.disabled = !node.disabled;
        app.simulation.reload()
    })

    nodeElem.find('.nodeConfig .enabled').toggle(!node.disabled && true)
    nodeElem.find('.nodeConfig .disabled').toggle(node.disabled || false)
    nodeElem.find('.nodeConfig .resetParameters').on('click', () => {
        nodeController.reset(node)
        app.simulation.simulate.run()
    })

    nodeElem.find('.deleteNode').on('click', (d) => {
        app.data.kernel.time = 0.0 // Reset simulation
        var nodeId = $(d.currentTarget).parents('.node').data('id');
        if (app.selected_node) {
            app.selected_node = app.selected_node.id == nodeId ? null : app.selected_node;
        }
        var nodes = app.data.nodes.filter((d) => d.id != nodeId);
        nodes.map((d, i) => {
            d.index = i;
            d.id = d.id > nodeId ? d.id - 1 : d.id;
        })
        app.data.nodes = nodes;
        var links = app.data.links.filter((d) => (d.source != nodeId && d.target != nodeId));
        if (links.length != app.data.links.length) {
            links.map((d, i) => {
                d.id = i;
                d.source = d.source > nodeId ? d.source - 1 : d.source;
                d.target = d.target > nodeId ? d.target - 1 : d.target;
            })
            app.data.links = links;
        }
        app.simulation.reload()
    })

    $('#nodeSpy .nav').append(app.renderer.node.spy(node))
    $('#nodeSpy').find('.node[data-id=' + node.id + ']').on('click', function(e) {
        if (app.graph.networkLayout.drawing) return
        app.selected_node = app.selected_node == node ? null : node;
        app.selected_link = null;
        app.graph.networkLayout.update()
        app.controller.update()
    })
    nodeController.update(node)
}

module.exports = nodeController;
