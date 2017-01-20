"use strict"

const models = require('./models');
const q = require('./store/query');
const slider = require('./slider');
var config = require('./config').global();

function init_button(data, nest_app) {
    get_network_list(data, nest_app)

    $('#network-add-submit').on('click', function(e) {
        q.add({
            date: new Date,
            name: $('#network-add-form #network-name').val(),
            nest_app: nest_app,
            data: data
        })
    })

    $("#network-config").find('#level_' + config.get('level')).find('.glyphicon-ok').show()

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
            config.set('level', parseInt($(this).attr('level')))
            slider.update_dataSlider_level()
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
    q.filter_by_nest_app(name).then(function(response) {
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
                window.running = false
                running_update(running)
                q.get(this.id).then(function(docs) {
                    data.sim_time = docs.data.sim_time || 1000.;
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
                    slider.update_dataSlider_level()
                    $('#network-add').attr('disabled', 'disabled');
                })
            })
        }, 10)
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

function running_update(running) {
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
    init_button: init_button,
    get_network_list: get_network_list,
    network_added: network_added,
    running_update: running_update
}
