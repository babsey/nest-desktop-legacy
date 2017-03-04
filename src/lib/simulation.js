"use strict"

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

var simulation = {}

simulation.list = function(q, ref) {
    return app.db.localDB.find(q)
}

simulation.export = function() {
    const config = app.config.app()
    var filepath = __dirname + '/../../' + config.get('db.local.path') + '/exports/' + app.data.name + '.json'
    jsonfile.writeFileSync(filepath, app.data)
}

simulation.run = function(running) {
    simulation.running = (running == true)
    if (simulation.running) {
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
    simulation.run(!simulation.running)
}

simulation.stop = function() {
    simulation.running = false
}

simulation.simulate = function() {
    if (simulation.running) return
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
                    var node = app.data.nodes[idx]
                    node.ids = res.nodes[idx].ids;
                    var title = app.format.replaceAll(node.model, '_', ' ') + '\nId: ' + app.format.truncate(node.ids)
                    $('#myScrollspy .nav').find('.node_' + node.id).attr('title', title)
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
    if (!(simulation.running)) return

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
    simulation.running = false;
    app.selected_node = null;
    app.selected_link = null;

    var date = app.format.date(app.data.createdAt)
    $('#title').html(app.data.name)
    $('#subtitle').empty()
    $('#subtitle').append(date ? '<span style="margin-left:20px">' + date + '</span>' : '')
    $('#subtitle').append(app.data.user ? '<span style="margin-left:20px">' + app.data.user + '</span>' : '')

    app.navigation.init()
    app.simChart.init()
    app.controller.init()
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
