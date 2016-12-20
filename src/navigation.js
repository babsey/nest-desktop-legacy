"use strict"

var slider = require('./slider');
var req = require('./request');

function get_network_list(data, name) {
    req.network_list(name).done(function(network_list) {
        $('#network-list').empty()
        for (var i = 0; i < network_list.length; i++) {
            var network = network_list[i];
            $('#network-list').append(
                '<a href="#" id="network_' + network.id +
                '" class="list-group-item network" title="' + network.timestamp + '">' +
                (i + 1) + ' - ' + (network.name ? network.name : network.timestamp) + '</a>')
        }

        $('.network').on('click', function(d) {
            req.network(this.id.split('_')[1]).done(function(r) {
                for (var nid in r.nodes) {
                    var node = r.nodes[nid];
                    data.nodes[nid].model = node.model;
                    data.nodes[nid].params = node.params
                    if (nid == 'neuron') {
                        data.nodes[nid].npop = node.npop;
                        data.nodes[nid].outdegree = node.outdegree;
                    }
                    $('#' + nid + ' select').val(node.model);
                    slider.update_paramslider(data)
                    slider.update_modelslider(data.nodes, nid, node.model, data.level, node.params)

                }
                $('#network-list').hide();
                $('#controller-panel').show();
                $('#get-network-list').removeClass('active');
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
            nodes: data.nodes
        })
    })

    $('#get-network-list').on('click', function() {
        if ($('#get-network-list').hasClass('active')) {
            $('#network-list').hide()
            $('#controller-panel').show()
            $(this).removeClass('active')
        } else {
            $('#network-list').show()
            $('#controller-panel').hide()
            $(this).addClass('active')
        }
    })

    $('.model_select').on('change', function() {
        if ((data.nodes.neuron.model != undefined) && (data.nodes.input.model != undefined)) {
            $('#network-add').attr('disabled', false)
        }
    })

    setTimeout(function() {
        $('.sliderInput').on('slideStop', function() {
            if ((data.nodes.neuron.model != undefined) && (data.nodes.input.model != undefined)) {
                $('#network-add').attr('disabled', false)
            }
        })
    }, 100)
}

module.exports = {
    init_button: init_button,
    get_network_list: get_network_list,
}
