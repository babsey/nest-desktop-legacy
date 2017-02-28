"use strict"

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

var simulation = {}

simulation.list = function(q, ref) {
    app.db.localDB.find(q).exec(function(err, docs) {
        if (docs.length == 0) return
        docs.map(function(doc) {
            $(ref).find('.simulation-list').append('<div id="' + doc._id + '"class="col-xs-12 col-sm-4 col-md-3"></div>')

            var href = './templates/simulation.html?simulation=' + doc._id
            $('#' + doc._id).append('<div class="thumbnail simulation"></div>')
            $('#' + doc._id).find('.thumbnail').append('<div style="position:absolute; z-index:10"><button class="btn btn-default"  type="button">' + doc.name + '</button></div>')
            $('#' + doc._id).find('.thumbnail').append('<a href="' + href + '"></a>')

            var filepath = '../data/images/' + doc._id + '.png'
            if (fs.existsSync(__dirname + path.sep + '..' + path.sep + filepath)) {
                $('#' + doc._id).find('a').append('<img src="' + filepath + '">')
            } else {
                $('#' + doc._id).find('a').append('<img src="assets/img/simulation_default.png">')
            }
        })
    });
}

simulation.export = function() {
    const config = app.config.app()
    var filepath = __dirname + '/../../' + config.get('db.local.path') + '/exports/' + app.data.name + '.json'
    jsonfile.writeFileSync(filepath, app.data)
}

simulation.run = function(ongoing) {
    app.running = (ongoing == true)
    if (app.running) {
        $('#simulation-resume').find('.fa').hide()
        $('#simulation-resume').find('.fa-pause').show()
        $('.dataSlider').find('.sliderInput').slider('disable')
        app.simulation.resume()
    } else {
        $('#simulation-resume').find('.fa').hide()
        $('#simulation-resume').find('.fa-play').show()
        $('.dataSlider').find('.sliderInput').slider('enable')
    }
}

simulation.resumeToggle = function() {
    app.simulation.run(!app.running)
}

simulation.stop = function() {
    app.running = false
}

simulation.simulate = function() {
    if (app.running) return
    var mId = app.message.show('Info', 'The simulation is running. Please wait.');

    app.data.nodes.filter(function(node) {
        return node.type == 'output'
    }).map(function(recNode) {
        recNode.events = {};
    })
    setTimeout(function() {
        app.request.request({
                network: app.data.network,
                kernel: app.data.kernel,
                sim_time: app.data.sim_time,
                nodes: app.data.nodes,
                links: app.data.links,
            })
            .done(function(res) {
                app.data.kernel.time = res.kernel.time;
                for (var idx in res.nodes) {
                    app.data.nodes[idx].ids = res.nodes[idx].ids;
                }
                app.data.nodes.filter(function(node) {
                    return node.type == 'output'
                }).map(function(recNode) {
                    recNode.params = res.nodes[recNode.id].params
                    if (recNode.model == 'multimeter') {
                        if (!(recNode.record_from in recNode.events)) {
                            recNode.record_from = 'V_m'
                        }
                        app.model.get_recordables_list(recNode)
                    } else if (recNode.model == 'voltmeter') {
                        recNode.record_from = 'V_m'
                    }
                    recNode.events = res.nodes[recNode.id].events;
                })
                app.simChart.update()

                var filepath = '../data/images/' + app.data._id + '.png'
                if (!fs.existsSync(__dirname + path.sep + '..' + path.sep + filepath)) {
                    app.screen.capture(app.data._id)
                }
                app.message.hide(mId)
                    // $('#content').fadeIn()
            })
    }, 10)
}

simulation.resume = function() {
    if (!(app.running)) return

    var recNode = app.data.nodes.filter(function(node) {
        return node.type == 'output'
    })[0]
    var dataEvents = recNode.events
    recNode.events = {};
    app.request.request({
            network: app.data.network,
            kernel: app.data.kernel,
            sim_time: app.data.res_time || 1.,
            nodes: app.data.nodes,
            links: app.data.links,
        })
        .done(function(res) {
            app.data.kernel.time = res.kernel.time;
            for (var key in res.nodes[recNode.id].events) {
                dataEvents[key] = dataEvents[key].concat(res.nodes[recNode.id].events[key])
                recNode.events[key] = dataEvents[key]
            }
            dataEvents = null;
            app.simChart.update()
            app.simulation.resume()
        })
}

simulation.init = function() {
    app.running = false;
    app.drawing = false;
    app.zooming = false;
    app.dragging = false;

    // mouse event vars
    app.selected_node = null;
    app.selected_link = null;
    app.mousedown_link = null;
    app.mousedown_node = null;
    app.mouseup_node = null;

    var date = app.format.date(app.data.createdAt)
    $('#title').html(app.data.name)
    $('#subtitle').empty()
    $('#subtitle').append(date ? '<span style="margin-left:20px">' + date + '</span>' : '')
    $('#subtitle').append(app.data.user ? '<span style="margin-left:20px">' + app.data.user + '</span>' : '')

    app.simChart.init()
    if (app.data.layout) {
        app.simChart.networkLayout.init('#chart')
    }
    app.navigation.init_controller()
    app.events.controllerHandler()
    if (app.data.runSimulation) {
        app.simulation.simulate()
    }
}

simulation.load = function(id) {
    app.db.get(id)
        .exec(function(err, docs) {
            app.data = docs;
            app.simulation.init()
        })
}

module.exports = simulation;
