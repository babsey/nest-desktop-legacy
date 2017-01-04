"use strict"

var models = require('./models');
var req = require('./request');
var slider = require('./slider');

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

    $('#level_' + window.level).find('.glyphicon-ok').show()

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
        $('.level').on('click', function() {
            $('.level').find('.glyphicon-ok').hide()
            window.level = parseInt($(this).attr('level'));
            for (var nid in data.nodes) {
                var node = data.nodes[nid];
                slider.update_paramSlider(node)
            }
            $(this).find('.glyphicon-ok').show()
        })
    }, 100)
}

function get_network_list(data, name) {
    $('#get-network-list').attr('disabled', 'disabled')
    $('#network-list').empty()
    req.network_list(name).done(function(network_list) {
        if (network_list.length == 0) return
        for (var i = 0; i < network_list.length; i++) {
            var network = network_list[i];
            $('#network-list').append(
                '<li><a href="#" id="network_' + network.id +
                '" class="network" title="' + network.timestamp + '">' +
                (i + 1) + ' - ' + (network.name ? network.name : network.timestamp) + '</a></li>')
        }
        $('#get-network-list').attr('disabled', false)

        $('.network').on('click', function(d) {
            req.network(this.id.split('_')[1]).done(function(r) {
                data.simtime = r.data.simtime || 1000.;
                data.kernel = r.data.kernel;
                for (var nid in r.data.nodes) {
                    var node = r.data.nodes[nid];
                    window.selected_node = data.nodes[nid];
                    selected_node.model = node.model;
                    models.model_selected(selected_node)
                    selected_node.params = node.params
                    if (selected_node.type == 'neuron') {
                        selected_node.n = node.n;
                    }
                    slider.update_paramSlider(selected_node)
                }
                for (var lid in r.data.links) {
                    var link = r.data.links[lid];
                    data.links[lid] = link;
                }
                $('#network-add').attr('disabled', 'disabled');
            })
        })
    })
}

function network_added(data, simulate, name) {
    $('#network-add-submit').on('click', function() {
        setTimeout(function() {
            get_network_list(data, name)
            setTimeout(function() {
                $('.network').on('click', function() {
                    setTimeout(simulate, 100)
                })
            }, 100)
        }, 100)
    })
}


module.exports = {
    init_button: init_button,
    get_network_list: get_network_list,
    network_added: network_added,
}
