"use strict"

var models = require('./models');
var network = require('./network');
var slider = require('./slider');

function init_button(data, nest_app) {
    get_network_list(data, nest_app)

    $('#network-add-submit').on('click', function(e) {
        network.add({
            date: new Date,
            name: $('#network-add-form #network-name').val(),
            nest_app: nest_app,
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
    network.filter(name).exec(function(err, docs) {
        if (docs.length == 0) return
        for (var i = 0; i < docs.length; i++) {
            var doc = docs[i];
            $('#network-list').append(
                '<li><a href="#" id="' + doc._id +
                '" class="network" title="' + doc.date + '">' +
                (i + 1) + ' - ' + (doc.name ? doc.name : doc.date) + '</a></li>')
        }
        $('#get-network-list').attr('disabled', false)

        $('.network').on('click', function(d) {
            network.get(this.id).exec(function(err, docs) {
                data.simtime = docs.data.simtime || 1000.;
                data.kernel = docs.data.kernel;
                for (var nid in docs.data.nodes) {
                    var node = docs.data.nodes[nid];
                    window.selected_node = data.nodes[nid];
                    selected_node.model = node.model;
                    models.model_selected(selected_node)
                    selected_node.params = node.params
                    if (selected_node.type == 'neuron') {
                        selected_node.n = node.n;
                    }
                    slider.update_paramSlider(selected_node)
                }
                for (var lid in docs.data.links) {
                    var link = docs.data.links[lid];
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
