"use strict"

const q = require('../store/query');
var config_global = require('../config').global();

function init_controller() {
    data.nodes.map(function(node, nidx) {
        $('#controller-panel .panel-body').append('<hr>')
        $('#controller-panel .panel-body').append('<div id="node_' + nidx + '" class="model ' + node.type + '" nidx="' + nidx + '"></div>')
        if (node.type == 'neuron' || node.type == 'input') {
            $('#controller-panel .panel-body').find('#node_' + nidx).append('<select id="select_' + nidx + '" class="' + node.type + 'Select form-control modelSelect"></select>')
            $('<option disabled selected hidden> Select an ' + node.type + ' device </option> ').appendTo("#select_" + nidx)
            $('#node_' + nidx).append('<div class="params"></div>')
            var modelDefaults = config.models(node.type)
            for (var midx in modelDefaults) {
                var model = modelDefaults[midx];
                $("<option class='modelSelect' id='" + model.id + "' value=" + model.id + ">" + model.label + "</option>").appendTo("#select_" + nidx)
                app.slider.init_paramSlider('#node_' + nidx + ' .params', model)
            }
        } else if (node.type == 'output') {
            if (node.model == 'multimeter') {
                $('#controller-panel .panel-body').find('#node_' + nidx).append('<div class="form-group"></div>')
                $('<label for="id_record"> Record from </label>').appendTo('#node_' + nidx + ' .form-group')
                $('<select id="id_record" class="form-control"></select>').appendTo('#node_' + nidx + ' .form-group')
            }
        }
    })
    app.slider.init_dataSlider()
    data.nodes.map(function(node) {
        if (node.model) {
            app.models.model_selected(node)
            app.slider.update_paramSlider(node)
        }
    })
}

function init_button(simulate) {
    get_network_list(simulate)
    $('#network-add-submit').on('click', function(e) {
        q.add({
            date: new Date,
            name: $('#network-add-form #network-name').val(),
            nest_app: simulation,
            data: data
        })
    })
    $("#network-config").find('#level_' + config_global.get('level')).find('.glyphicon-ok').show()
}

function get_network_list(simulate) {
    $('#get-network-list').attr('disabled', 'disabled')
    $('#network-list').empty()
    q.filter_by_nest_app(simulation).then(function(response) {
        if (response.length == 0) return
        for (var i = 0; i < response.length; i++) {
            var doc = q.get(response[i]).then(function(docs) {
                $('#network-list').append(
                    '<li><a href="#" id="' + docs._id +
                    '" class="network" title="' + docs.date + '">' +
                    // (i + 1) + ' - ' +
                    (docs.name ? docs.name : docs.date) + '</a></li>')
            });
        }
        $('#get-network-list').attr('disabled', false)
        setTimeout(function() {
            $('.network').on('click', function(d) {
                $('#autoscale').prop('checked', 'checked')
                run(false)
                q.get(this.id).then(function(docs) {
                    data.sim_time = docs.data.sim_time || 1000.;
                    data.kernel = docs.data.kernel;
                    for (var nid in docs.data.nodes) {
                        var node = docs.data.nodes[nid];
                        window.selected_node = data.nodes[nid];
                        selected_node.model = node.model;
                        app.models.model_selected(selected_node)
                        selected_node.params = node.params
                        if (selected_node.type == 'neuron') {
                            selected_node.n = node.n;
                        }
                        app.slider.update_paramSlider(selected_node)
                    }
                    for (var lid in docs.data.links) {
                        var link = docs.data.links[lid];
                        data.links[lid] = link;
                    }
                    app.slider.update_dataSlider()
                    $('#network-add').attr('disabled', 'disabled');
                    setTimeout(simulate, 100)
                })
            })
        }, 100)
    })
}

function run(running) {
    window.running = running
    if (running) {
        $('#network-resume').find('.glyphicon').hide()
        $('#network-resume').find('.glyphicon-pause').show()
        $('.dataSlider').find('.sliderInput').slider('disable')
    } else {
        $('#network-resume').find('.glyphicon').hide()
        $('#network-resume').find('.glyphicon-play').show()
        $('.dataSlider').find('.sliderInput').slider('enable')
    }
}


module.exports = {
    init_controller: init_controller,
    init_button: init_button,
    get_network_list: get_network_list,
    run: run
}
