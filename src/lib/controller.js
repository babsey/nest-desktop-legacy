"use strict"

var controller = {};

controller.init = function() {
    $('#global .content').empty()
    var modelDefaults = app.config.modelSlider('global')
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        model.value = app.data[model.id];
        app.slider.init_globalSlider(model)
    }

    $('#kernel .content').empty()
    var modelDefaults = app.config.modelSlider('kernel')
    var model = modelDefaults[0];
    model.value = app.data.kernel[model.id];
    app.slider.init_kernelSlider(model)
    var borderWidth = '4px';

    var colors = app.simChart.colors;

    var nodeDefaults = app.config.modelSlider('node');
    $('#nodes').empty()
    $('#nodeScrollspy .nav').empty()
    app.data.nodes.map(function(node) {
        // if (node.hidden) return
        $('#nodeScrollspy .nav').append(app.render.scrollspy(node))
        $('#nodes').append(app.render.node(node))
        if (node.type == 'neuron' || node.type == 'input') {
            nodeDefaults[0].value = node.n || 1
            app.slider.init_popSlider(node.id, nodeDefaults[0])
        }
        if (node.model == 'spike_detector') {
            nodeDefaults[1].value = nodeDefaults[1].ticks_labels.indexOf(node.nbins) || 1
            app.slider.init_binSlider(node.id, nodeDefaults[1])
        }
        var divNode = $('#nodes').find('#node_' + node.id).find('.content')
        var modelDefaults = app.config.modelSlider(node.type)
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divNode.find(' .modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            if (model.id == node.model) {
                app.slider.init_modelSlider('#node_' + node.id + ' .modelSlider', model)
            }
        }

        if (node.type == 'output') {
            if (node.model == 'multimeter') {
                divNode.append('<div class="recSelect form-group"></div>')
                divNode.find('.recSelect').append('<label for="id_record">Record from</label>')
                divNode.find('.recSelect').append('<select id="id_record" class="form-control"></select>')
            }
        }

        divNode.find('option#' + node.model).prop('selected', true);
        app.slider.update_nodeSlider(node)

        divNode.find('.slider-selection').css('background', colors[node.id % colors.length])
        divNode.find('.slider-handle').css('border', '2px solid ' + colors[node.id % colors.length])
    })

    $('#connections').empty();
    $('#synapses').empty();
    app.data.links.map(function(link) {
        if (app.data.nodes[link.source].hidden || app.data.nodes[link.target].hidden) return

        // Connection
        $('#connections').append(app.render.connection(link))
        var divConnLink = $('#connections').find('#conn_' + link.id).find('.content')
        var modelDefaults = app.config.modelSlider('connection')
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divConnLink.find('.connSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            if (link.conn_spec == null) continue
            if (model.id == link.conn_spec.rule) {
                app.slider.init_modelSlider('#conn_' + link.id + ' .connSlider', model)
            }
        }
        divConnLink.find('.connSelect').find('option#' + (link.conn_spec ? link.conn_spec.rule || 'all_to_all' : 'all_to_all')).prop('selected', true);
        app.slider.update_connSlider(link)

        divConnLink.find('.slider-selection').css('background', colors[link.source % colors.length])
        divConnLink.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])


        // Synapse
        $('#synapses').append(app.render.synapse(link))
        var divSynLink =  $('#synapses').find('#syn_' + link.id).find('.content')
        var modelDefaults = app.config.modelSlider('synapse')
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divSynLink.find('.modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            if (link.syn_spec == null) continue
            if (model.id == link.syn_spec.model) {
                app.slider.init_modelSlider('#syn_' + link.id + ' .synSlider', model)
            }
        }
        if (!link.syn_spec || !link.syn_spec.model) {
            var model = modelDefaults[1];
            app.slider.init_modelSlider('#syn_' + link.id + ' .synSlider', model)
        }
        divSynLink.find('.modelSelect').find('option#' + (link.syn_spec ? link.syn_spec.model || 'static_synapse' : 'static_synapse')).prop('selected', true);
        app.slider.update_synSlider(link)

        divSynLink.find('.slider-selection').css('background', colors[link.source % colors.length])
        divSynLink.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])

    })

    // app.slider.init_dataSlider()
    // data.nodes.map(function(node) {
    //     if (node.model) {
    //         app.models.model_selected(node)
    //     }
    // })
    
    app.events.controller()
}

module.exports = controller;
