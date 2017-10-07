"use strict"

const flat = require('flat');
const math = require('mathjs');

var simulate = {};

simulate.simulate = (run) => {
    if (!app.serverRunning) return
    if (app.chart.networkLayout.drawing) return
    if (!(app.simulation.runAfterChange || run)) return
    if (app.simulation.running) return
    if (app.simulation.recorders.length == 0) return
    if (app.simulation.recorders.filter((recorder) => {
            return recorder.node.model != undefined
        }).length == 0) return
    if (app.simulation.recorders.filter((recorder) => {
            return !(recorder.node.disabled == true)
        }).length == 0) return
    if (app.simulation.autoReset) {
        app.data.kernel.time = 0.0;
    }
    if (app.simulation.randomSeed) {
        app.data.random_seed = parseInt(Math.random() * 1000);
        app.slider.update_simulationSlider()
    }

    app.request.request({
            id: app.data._id,
            network: app.data.network,
            kernel: app.data.kernel,
            random_seed: app.data.random_seed || 0,
            sim_time: app.data.sim_time || 1000.,
            nodes: flat.unflatten(app.data.nodes.map((node) => {
                node.params = flat.unflatten(node.params, {
                    delimiter: '__'
                })
                return node
            })),
            links: app.data.links,
        })
        .done((response) => {
            // if (response.error) return
            for (var idx in response.data.nodes) {
                var node = app.data.nodes[idx]
                node.ids = response.data.nodes[idx].ids;
                var title = app.format.nodeTitle(node)
                $('#nodeScrollspy .nav').find('.node_' + node.id).attr('title', title)
            }
            app.simulation.recorders.map((recorder) => {
                recorder.node.params = response.data.nodes[recorder.node.id].params
                if (recorder.node.model == 'multimeter') {
                    if (recorder.node.record_from) {
                        var record_from = recorder.node.record_from.filter((record_from) => {
                            return recorder.node.params.record_from.indexOf(record_from) != -1
                        })
                        recorder.node.record_from = record_from;
                    } else {
                        recorder.node.record_from = recorder.node.params.record_from.filter((record_from) => {
                            return record_from.indexOf('V_m') != -1
                        })
                    }
                } else if (recorder.node.model == 'voltmeter') {
                    recorder.node.record_from = ['V_m']
                }
                if (app.data.kernel.time == 0.0) {
                    recorder.events = response.data.nodes[recorder.node.id].events;
                } else {
                    for (var key in response.data.nodes[recorder.node.id].events) {
                        recorder.events[key] = recorder.events[key].concat(response.data.nodes[recorder.node.id].events[key])
                    }
                }
                recorder.senders = math.sort(recorder.events.senders.filter(
                    (v, i, a) => a.indexOf(v) === i
                ));
                recorder.sources = app.data.links.filter(
                    (link) => link.target == recorder.node.id
                ).map(
                    (link) => app.data.nodes[link.source].id
                );
                if (['voltmeter', 'multimeter'].indexOf(recorder.node.model) != -1) {
                    app.chart.data.times = recorder.events.times.filter(
                        (d, i) => ((recorder.events.senders[i] == recorder.senders[0]))
                    )
                } else if (!app.chart.data.times) {
                    app.chart.data.times = d3.extent(recorder.events.times)
                }
                app.controller.node.update(recorder.node)
            });
            var nodeDefaults = app.config.nest('node');
            app.simulation.stimulators.map((stimulator) => {
                stimulator.events = {}
                if (stimulator.node.model == 'step_current_generator') {
                    if (stimulator.node.params.amplitude_times.length == app.chart.data.times.length) {
                        stimulator.events.currents = stimulator.node.params.amplitude_values
                    } else {
                        var amplitudes = [].concat.apply([0], stimulator.node.params.amplitude_values).filter((d, i) => {
                            var time = stimulator.node.params.amplitude_times[i - 1];
                            return time <= (stimulator.node.params.stop || app.data.sim_time || 1000.)
                        });
                        var times = [].concat.apply([0], stimulator.node.params.amplitude_times).filter(
                            (d, i) => d <= (stimulator.node.params.stop || app.data.sim_time || 1000.)
                        );
                        var times_rounded = numeric.round(numeric.div(times, (app.data.kernel.resolution || 1.0)));
                        var dtimes = times_rounded.map((time, i) => {
                            if (i == 0) return (stimulator.node.amplitude_dtime || nodeDefaults.amplitude_dtime.value) / (app.data.kernel.resolution || 1.0);
                            return time - times_rounded[i - 1]
                        });
                        var amplitude_series = dtimes.map(
                            (dt, i) => numeric.rep([dt], amplitudes[i] * (stimulator.node.n || 1))
                        );
                        stimulator.events.currents = [].concat.apply([], amplitude_series).slice(0, app.chart.data.times.length);
                    }
                }
                app.controller.node.update(stimulator.node)
            })
            app.data.kernel.time = response.data.kernel.time;
            app.chart.update()
            app.controller.update()
            app.protocol.all().exec((err, docs) => {
                if ((docs.length == 0) || (app.simulation.autoProtocol) || app.protocol.id == undefined) {
                    app.protocol.add()
                    app.screen.capture(app.data, false)
                }
            })
        })
}

module.exports = simulate;
