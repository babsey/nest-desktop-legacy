"use strict"

const jsonfile = require('jsonfile');
const flat = require('flat');

var simulation = {
    data: {}
}

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
    if (app.chart.networkLayout.drawing) return
    if (simulation.running) return
    if (simulation.recorders.length == 0) return
    if (simulation.recorders.filter(function(recorder) {
            return recorder.node.model != undefined
        }).length == 0) return
    if (simulation.recorders.filter(function(recorder) {
            return !(recorder.node.disabled == true)
        }).length == 0) return

    var mId = app.message.show('Info', 'The simulation is running. Please wait.');
    var data = $.extend(true, {}, app.data);
    setTimeout(function() {
        var tic = new Date();
        console.log(tic)
        app.request.request({
                network: app.data.network,
                kernel: app.data.kernel,
                sim_time: app.data.sim_time,
                nodes: flat.unflatten(app.data.nodes.map(function(node) {
                    node.params = flat.unflatten(node.params, {
                        delimiter: '__'
                    })
                    return node
                })),
                links: app.data.links,
            })
            .done(function(res) {
                var toc = new Date();
                app.data.kernel.time = res.kernel.time;
                for (var idx in res.nodes) {
                    var node = app.data.nodes[idx]
                    node.ids = res.nodes[idx].ids;
                    var title = app.format.nodeTitle(node)
                    $('#myScrollspy .nav').find('.node_' + node.id).attr('title', title)
                }
                simulation.recorders.map(function(recorder) {
                    recorder.node.params = res.nodes[recorder.node.id].params
                    if (recorder.node.model == 'multimeter') {
                        if (recorder.node.record_from) {
                            var record_from = recorder.node.record_from.filter(function(record_from) {
                                return recorder.node.params.record_from.indexOf(record_from) != -1
                            })
                            recorder.node.record_from = record_from;
                        } else {
                            recorder.node.record_from = recorder.node.params.record_from.filter(function(record_from) {
                                return record_from.indexOf('V_m') != -1
                            })
                        }
                        app.model.get_recordables_list(recorder.node)
                    } else if (recorder.node.model == 'voltmeter') {
                        recorder.node.record_from = ['V_m']
                    }
                    recorder.events = res.nodes[recorder.node.id].events;
                    recorder.senders = d3.merge(app.data.links.filter(function(link) {
                        return link.target == recorder.node.id
                    }).map(function(link) {
                        return app.data.nodes[link.source].ids ? app.data.nodes[link.source].ids : []
                    }))
                    recorder.sources = app.data.links.filter(function(link) {
                        return link.target == recorder.node.id
                    }).map(function(link) {
                        return app.data.nodes[link.source].id
                    })
                });
                app.chart.update();
                app.message.hide(mId).remove();
                var toe = new Date;
                var ts = {
                    tic: tic,
                    toc: toc,
                    toe: toe
                };
                app.protocol.add(data);
            })
    }, 10)
}

simulation.resume = function() {
    if (!(simulation.running)) return

    app.request.request({
            network: app.data.network,
            kernel: app.data.kernel,
            sim_time: app.data.res_time || 1.,
            nodes: app.data.nodes,
            links: app.data.links,
        })
        .done(function(res) {
            if (!simulation.running) return
            app.data.kernel.time = res.kernel.time;
            simulation.recorders.map(function(recorder) {
                for (var key in res.nodes[recorder.node.id].events) {
                    recorder.events[key] = recorder.events[key].concat(res.nodes[recorder.node.id].events[key])
                }
                recorder.senders = d3.merge(app.data.links.filter(function(link) {
                    return link.target == recorder.node.id
                }).map(function(link) {
                    return app.data.nodes[link.source].ids
                }))
            })
            app.chart.update()
            app.simulation.resume()
        })
}

simulation.update = function() {
    simulation.running = false;
    app.selected_node = null;
    app.selected_link = null;
    // app.changes = {
    //     nodes: app.data.nodes.map(function() {
    //         return {}
    //     }),
    //     links: app.data.links.map(function() {
    //         return {}
    //     })
    // }
    $('#title').html(app.data.name)
    $('#subtitle').empty()
    if (app.data.createdAt) {
        var date = app.format.date(app.data.createdAt)
        $('#subtitle').append(date ? '<span style="margin-left:20px">' + date + '</span>' : '')
    }
    $('#subtitle').append(app.data.user ? '<span style="margin-left:20px">' + app.data.user + '</span>' : '')

    simulation.recorders = app.data.nodes.filter(function(node) {
        return node.element_type == 'recorder' && !node.disabled
    }).map(function(node) {
        return {
            node: node,
            sources: app.data.links.filter(function(link) {
                return link.target == node.id
            }).map(function(link) {
                return app.data.nodes[link.source].id
            })
        }
    })

    app.data.links.map(function(link) {
        link.conn_spec = link.conn_spec ? link.conn_spec : {}
        link.syn_spec = link.syn_spec ? link.syn_spec : {}
    })

    app.chart.init()
    app.controller.init()
    app.simulation.simulate()
}

simulation.init = function() {
    app.db.init()
    app.navigation.init()
    setTimeout(function() {
        app.db.get(app.simulation.id)
            .exec(function(err, docs) {
                app.data = docs;
                app.simulation.update()
            })
    }, 200)
}

module.exports = simulation;
