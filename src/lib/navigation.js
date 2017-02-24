"use strict"

var navigation = {};

navigation.init_controller = function() {
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

    var nodeDefaults = app.config.modelSlider('node')
    var divNodes = $('#nodes');
    divNodes.empty()
    app.data.nodes.map(function(node) {
        $("#myScrollspy .nav").append('<li><a class="node_' + node.id + '" href="#node_' + node.id + '">' + node.type.charAt(0).toUpperCase() + '</a></li>')

        divNodes.append('<div id="node_' + node.id + '" class="panel-body node ' + node.type + '" nidx="' + node.id + '"></div>')
        divNodes.find('#node_' + node.id).append('<hr>')
        divNodes.find('#node_' + node.id).append('<div class="content"></div>')
        var divNode = divNodes.find('#node_' + node.id).find('.content')
            // divNode.append('<div style="height:50px"></div>')
        divNode.css('border-left', borderWidth + ' solid ' + app.networkLayout.colors[node.id])
            // divNode.css('border-right', borderWidth + ' solid ' + app.networkLayout.colors[node.id])
        divNode.append('<select id="select_' + node.id + '" class="' + node.type + 'Select modelSelect form-control"></select>')
        divNode.find(' .modelSelect').append('<option disabled selected hidden>Select an ' + node.type + ' device</option> ')

        if (node.type == 'neuron' || node.type == 'input') {
            nodeDefaults[0].value = node.n || 1
            app.slider.init_popSlider(node.id, nodeDefaults[0])
        }
        if (node.model == 'spike_detector') {
            nodeDefaults[1].value = nodeDefaults[1].ticks_labels.indexOf(node.nbins) || 1
            app.slider.init_binSlider(node.id, nodeDefaults[1])
        }

        divNode.append('<div class="modelSlider"></div>')
        var modelDefaults = app.config.modelSlider(node.type)
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divNode.find(' .modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            app.slider.init_modelSlider('#node_' + node.id + ' .modelSlider', model)

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
    })

    var divConnections = $('#connections');
    divConnections.empty()
    var divSynapses = $('#synapses');
    divSynapses.empty()
    app.data.links.map(function(link) {

        // Connection
        divConnections.append('<div id="conn_' + link.id + '" class="panel-body link synapse" lidx="' + link.id + '"></div>')
        divConnections.find('#conn_' + link.id).append('<hr>')
        divConnections.find('#conn_' + link.id).append('<div class="content"></div>')
        var divConnLink = divConnections.find('#conn_' + link.id).find('.content')
        divConnLink.css('border-left', borderWidth + ' solid ' + app.networkLayout.colors[link.source])
        divConnLink.css('border-right', borderWidth + ' solid ' + app.networkLayout.colors[link.target])
        divConnLink.append('<select class="connSelect modelSelect form-control"></select>')
        divConnLink.find('.modelSelect').append('<option disabled selected hidden>Select a connection rule</option> ')
        divConnLink.append('<div class="connSlider"></div>')
        var modelDefaults = app.config.modelSlider('connection')
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divConnLink.find('.connSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            app.slider.init_modelSlider('#conn_' + link.id + ' .connSlider', model)
        }
        divConnLink.find('.connSelect').find('option#' + (link.conn_spec ? link.conn_spec.rule || 'all_to_all' : 'all_to_all')).prop('selected', true);
        app.slider.update_connSlider(link)

        // Synapse
        divSynapses.append('<div id="syn_' + link.id + '" class="panel-body link synapse" lidx="' + link.id + '"></div>')
        divSynapses.find('#syn_' + link.id).append('<hr>')
        divSynapses.find('#syn_' + link.id).append('<div class="content"></div>')
        var divSynLink = divSynapses.find('#syn_' + link.id).find('.content')
        divSynLink.css('border-left', borderWidth + ' solid ' + app.networkLayout.colors[link.source])
        divSynLink.css('border-right', borderWidth + ' solid ' + app.networkLayout.colors[link.target])
        divSynLink.append('<select class="synSelect modelSelect form-control"></select>')
        divSynLink.find('.modelSelect').append('<option disabled selected hidden>Select a synapse</option> ')
        divSynLink.append('<div class="synSlider"></div>')
        var modelDefaults = app.config.modelSlider('synapse')
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divSynLink.find('.modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            app.slider.init_modelSlider('#syn_' + link.id + ' .synSlider', model)
        }
        divSynLink.find('.modelSelect').find('option#' + (link.syn_spec ? link.syn_spec.model || 'static_synapse' : 'static_synapse')).prop('selected', true);
        app.slider.update_synSlider(link)

    })

    // app.slider.init_dataSlider()
    // data.nodes.map(function(node) {
    //     if (node.model) {
    //         app.models.model_selected(node)
    //     }
    // })
    $("#simulation-config").find('#level_' + app.config.app().get('level')).find('.glyphicon-ok').show()
    navigation.load_simulationList()
}

navigation.load_simulationList = function() {
    $('#get-simulation-list').attr('disabled', 'disabled')
    $('#simulation-list').empty()
    app.db.all().exec(function(err, docs) {
        if (docs.length == 0) return
        docs.map(function(doc) {
            $('#simulation-list').append(
                '<li><a href="#" id="' + doc._id +
                '" class="simulation" title="' + app.format.date(doc.updatedAt) + '">' + doc.name + '</a></li>')
        });
        $('#get-simulation-list').attr('disabled', false)
        setTimeout(function() {
            $('.simulation').on('click', function(d) {
                app.simulation.stop()
                location.href = location.origin + location.pathname + '?simulation=' + this.id
                    // $('#autoscale').prop('checked', true)
                    // app.simulation.load(this.id)
            })
        }, 100)
    })
}

module.exports = navigation;
