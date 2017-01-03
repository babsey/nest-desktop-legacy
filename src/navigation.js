"use strict"

var slider = require('./slider');
var req = require('./request');

function get_network_list(data, name) {
    req.network_list(name).done(function(network_list) {
        $('#network-list').empty()
        for (var i = 0; i < network_list.length; i++) {
            var network = network_list[i];
            $('#network-list').append(
                '<li><a href="#" id="network_' + network.id +
                '" class="network" title="' + network.timestamp + '">' +
                (i + 1) + ' - ' + (network.name ? network.name : network.timestamp) + '</a></li>')
        }

        $('.network').on('click', function(d) {
            req.network(this.id.split('_')[1]).done(function(r) {
                data.simtime = r.data.simtime || 1000.;
                data.kernel = r.data.kernel || {
                    grng_seed: 0
                };
                for (var nid in r.data.nodes) {
                    var node = r.data.nodes[nid];
                    selected_node = data.nodes[nid];
                    selected_node.model = node.model;
                    selected_node.params = node.params
                    if (selected_node.type == 'neuron') {
                        selected_node.npop = node.npop;
                        selected_node.outdegree = node.outdegree;
                    }
                    slider.update_paramslider(data)
                    slider.update_modelslider(selected_node, data.level, node.params)

                }
                $('#network-add').attr('disabled', 'disabled');
            })
        })
    })
}

function init_button(data, name) {
    get_network_list(data, name)

    $('#network-add-submit').on('click', function(e) {
        var network_name = $('#network-add-form #network-name').val();
        req.network_add({
            name: network_name,
            nest_app: name,
            data: data
        })
    })

    setTimeout(function() {
        $('.modelSelect').on('click', function() {
            if ((data.nodes[0].model != undefined) && (data.nodes[1].model != undefined)) {
                $('#network-add').attr('disabled', false)
            }
        })

        $('.sliderInput').on('slideStop', function() {
            if ((data.nodes[0].model != undefined) && (data.nodes[1].model != undefined)) {
                $('#network-add').attr('disabled', false)
            }
        })
    }, 100)
}

module.exports = {
    init_button: init_button,
    get_network_list: get_network_list,
}
