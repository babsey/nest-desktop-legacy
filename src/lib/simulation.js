"use strict"

const math = require('mathjs');
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

simulation.simulate = function(run) {
    if (app.chart.networkLayout.drawing) return
    if (!(simulation.runAfterChange || run)) return
    if (simulation.running) return
    if (simulation.recorders.length == 0) return
    if (simulation.recorders.filter(function(recorder) {
            return recorder.node.model != undefined
        }).length == 0) return
    if (simulation.recorders.filter(function(recorder) {
            return !(recorder.node.disabled == true)
        }).length == 0) return

    $('#message .content').empty()
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
            .done(function(response) {
                var toc = new Date();
                if (response.error) {
                    app.message.hide(mId).remove();
                    app.message.show('NEST Error:', response.error);
                    return
                }
                app.data.kernel.time = response.data.kernel.time;
                for (var idx in response.data.nodes) {
                    var node = app.data.nodes[idx]
                    node.ids = response.data.nodes[idx].ids;
                    var title = app.format.nodeTitle(node)
                    $('#nodeScrollspy .nav').find('.node_' + node.id).attr('title', title)
                }
                simulation.recorders.map(function(recorder) {
                    recorder.node.params = response.data.nodes[recorder.node.id].params
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
                    } else if (recorder.node.model == 'voltmeter') {
                        recorder.node.record_from = ['V_m']
                    }
                    recorder.events = response.data.nodes[recorder.node.id].events;
                    recorder.senders = math.sort(recorder.events.senders.filter((v, i, a) => a.indexOf(v) === i));
                    recorder.sources = app.data.links.filter(function(link) {
                        return link.target == recorder.node.id
                    }).map(function(link) {
                        return app.data.nodes[link.source].id
                    })
                    if (['voltmeter', 'multimeter'].indexOf(recorder.node.model) != -1) {
                        app.chart.data.times = recorder.events.times.filter(function(d, i) {
                            return ((recorder.events.senders[i] == recorder.senders[0]))
                        })
                    } else if (!app.chart.data.times) {
                        app.chart.data.times = d3.extent(recorder.events.times)
                    }
                    app.controller.node.update(recorder.node)
                });
                var nodeDefaults = app.config.nest('node');
                simulation.stimulators.map(function(stimulator) {
                    stimulator.events = {}
                    if (stimulator.node.model == 'step_current_generator') {
                        if (stimulator.node.params.amplitude_times.length == app.chart.data.times.length) {
                            stimulator.events.currents = stimulator.node.params.amplitude_values
                        } else {
                            var amplitudes = [].concat.apply([0], stimulator.node.params.amplitude_values).filter(function(d, i) {
                                var time = stimulator.node.params.amplitude_times[i - 1];
                                return time <= (stimulator.node.params.stop || app.data.sim_time)
                            });
                            var times = [].concat.apply([0], stimulator.node.params.amplitude_times).filter(function(d, i) {
                                return d <= (stimulator.node.params.stop || app.data.sim_time)
                            });
                            var times_rounded = numeric.round(numeric.div(times, (app.data.kernel.resolution || 1.0)))
                            var dtimes = times_rounded.map(function(time, i) {
                                if (i == 0) return (stimulator.node.amplitude_dtime || nodeDefaults.amplitude_dtime.value) / (app.data.kernel.resolution || 1.0);
                                return time - times_rounded[i - 1]
                            })
                            var amplitude_series = dtimes.map(function(dt, i) {
                                return numeric.rep([dt], amplitudes[i] * (stimulator.node.n || 1))
                            })
                            stimulator.events.currents = [].concat.apply([], amplitude_series).slice(0, app.chart.data.times.length);
                        }
                    }
                    app.controller.node.update(stimulator.node)
                })
                app.controller.update()
                app.chart.update();
                app.protocol.update()
                app.message.hide(mId).remove();
                var toe = new Date;
                var ts = {
                    tic: tic,
                    toc: toc,
                    toe: toe
                };
                if (app.simulation.protocol) {
                    app.protocol.add(data);
                }
                if (app.simulation.id == app.data._id) {
                    $('#raw-data').find('a').attr('href', './raw_data.html?simulation=' + app.simulation.id)
                } else {
                    $('#raw-data').find('a').attr('href', './raw_data.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id)
                }
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
        .done(function(response) {
            if (response.error) {
                app.message.show('Warning', response.error, 2000)
                return
            }
            if (!simulation.running) return
            app.data.kernel.time = response.data.kernel.time;
            if ($('#autoscale').prop('checked')) {
                app.chart.xScale.domain([app.data.kernel.time - app.data.sim_time, app.data.kernel.time])
            }
            simulation.recorders.map(function(recorder) {
                for (var key in response.data.nodes[recorder.node.id].events) {
                    recorder.events[key] = recorder.events[key].concat(response.data.nodes[recorder.node.id].events[key])
                }
                recorder.senders = d3.merge(app.data.links.filter(function(link) {
                    return link.target == recorder.node.id
                }).map(function(link) {
                    return app.data.nodes[link.source].ids
                }))
                app.chart.data.times = recorder.events.times.filter(function(d, i) {
                    return ((recorder.events.senders[i] == recorder.senders[0]))
                })
            })
            app.controller.update()
            app.chart.update()
            app.simulation.resume()
        })
}

simulation.update = function() {

    simulation.running = false;
    app.selected_node = null;
    app.selected_link = null;

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
    simulation.stimulators = app.data.nodes.filter(function(node) {
        return node.element_type == 'stimulator' && !node.disabled
    }).map(function(node) {
        return {
            node: node,
            targets: app.data.links.filter(function(link) {
                return link.source == node.id
            }).map(function(link) {
                return app.data.nodes[link.target].id
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
    app.protocol.init()

    setTimeout(function() {
        if (app.protocol.id) {
            app.protocol.get(app.protocol.id)
                .exec(function(err, docs) {
                    app.data = docs;
                    app.simulation.update()
                })
        } else {
            app.db.get(app.simulation.id)
                .exec(function(err, docs) {
                    app.data = docs;
                    app.simulation.update()
                })
        }
    }, 200)


}



module.exports = simulation;
