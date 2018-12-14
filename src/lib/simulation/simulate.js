"use strict"

const flat = require('flat');
const math = require('mathjs');

var simulate = {};

simulate.run = () => {
    if (!app.serverRunning) return
    if (app.graph.networkLayout.drawing) return
    if (app.simulation.recorders.length == 0) {
        app.message.show('Info', 'Build a network with at least a recorder.')
        return
    }
    if (app.simulation.recorders.filter((recorder) => {
            return recorder.node.model != undefined
        }).length == 0) {
        app.message.show('Info', 'Select a model for recorder')
        return
    }
    if (app.simulation.autoReset) {
        app.data.kernel.time = 0.0;
    }
    if (app.simulation.randomSeed) {
        app.data.random_seed = parseInt(Math.random() * 1000);
        app.controller.simulation.update({
            id: 'random_seed'
        })
    }
    if (app.data.kernel.resolution != undefined) {
        app.simulation.recorders.map((recorder) => {
            // console.log(recorder.node.params.interval, app.data.kernel.resolution)
            // if (recorder.node.params.interval == undefined) {
            recorder.node.params.interval = app.data.kernel.resolution;
            // } else {
            //     var interval = recorder.node.params.interval;
            //     var resolution = app.data.kernel.resolution || 1.0;
            //     if (interval < resolution) {
            //         app.data.kernel.resolution = interval;
            //         app.controller.kernel.update({
            //             id: 'resolution'
            //         })τ
            //         app.message.show('Info', 'Time resolution of the simulation was changed. See time interval of the recording devices.')
            //     }
            // }
        })
    }

    var chart = app.graph.chart;
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
            if (response.error) {
                app.message.show('NEST Error', response.error)
                simulate.end()
                return
            }
            for (var idx in response.data.nodes) {
                var node = app.data.nodes[idx]
                node.ids = response.data.nodes[idx].ids;
                var title = app.format.nodeTitle(node)
            }
            app.simulation.recorders.map((recorder) => {
                recorder.node.params = response.data.nodes[recorder.node.id].params
                if (recorder.node.model == 'multimeter') {
                    if (recorder.node.params.record_from.length == 1) {
                        recorder.node.data_from = recorder.node.params.record_from
                    } else if (recorder.node.data_from) {
                        var data_from = recorder.node.data_from.filter((data) => {
                            return recorder.node.params.record_from.indexOf(data) != -1
                        })
                        recorder.node.data_from = data_from;
                    } else {
                        recorder.node.data_from = recorder.node.params.record_from.filter((record_from) => {
                            return record_from.indexOf('V_m') != -1
                        })
                    }
                } else if (recorder.node.model == 'voltmeter') {
                    recorder.node.data_from = ['V_m']
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
                    chart.data.times = recorder.events.times.filter(
                        (d, i) => ((recorder.events.senders[i] == recorder.senders[0]))
                    )
                } else if (!chart.data.times) {
                    chart.data.times = d3.extent(recorder.events.times)
                }
                chart.data.times.unit = 'ms';
                app.controller.node.update(recorder.node)
            });
            var nodeDefaults = app.config.nest('node');
            // app.simulation.stimulators.map((stimulator) => {
            //     stimulator.events = {}
            //     if (stimulator.node.model == 'step_current_generator') {
            //         if (stimulator.node.params.amplitude_times.length == chart.data.times.length) {
            //             stimulator.events.currents = stimulator.node.params.amplitude_values
            //         } else {
            //             var amplitudes = [].concat.apply([0], stimulator.node.params.amplitude_values).filter((d, i) => {
            //                 var time = stimulator.node.params.amplitude_times[i - 1];
            //                 return time <= (stimulator.node.params.stop || app.data.sim_time || 1000.)
            //             });
            //             var times = [].concat.apply([0], stimulator.node.params.amplitude_times).filter(
            //                 (d, i) => d <= (stimulator.node.params.stop || app.data.sim_time || 1000.)
            //             );
            //             var times_rounded = numeric.round(numeric.div(times, (app.data.kernel.resolution || 1.0)));
            //             var dtimes = times_rounded.map((time, i) => {
            //                 if (i == 0) return (stimulator.node.amplitude_dtime || nodeDefaults.amplitude_dtime.value) / (app.data.kernel.resolution || 1.0);
            //                 return time - times_rounded[i - 1]
            //             });
            //             var amplitude_series = dtimes.map(
            //                 (dt, i) => numeric.rep([dt], amplitudes[i] * (stimulator.node.n || 1))
            //             );
            //             stimulator.events.currents = [].concat.apply([], amplitude_series).slice(0, chart.data.times.length);
            //         }
            //     }
            //     app.controller.node.update(stimulator.node)
            // })
            app.data.kernel.time = response.data.kernel.time;
            app.graph.update()
            app.controller.update()
            app.protocol.all().exec((err, docs) => {
                app.screen.capture(app.data, false)
                if (docs.length == 0 || app.protocol.id == undefined || app.simulation.autoProtocol) {
                    app.protocol.add()
                }
            })
        })
}

simulate.init = () => {
    if (!app.simulation.autoSimulation) return
    if (app.graph.networkLayout.drawing) return
    if (app.simulation.running) return
    simulate.run()
}

simulate.start = () => {
    if (app.simulation.running) return
    app.controller.activeNode = $(document.activeElement).parents('.node').attr('id');
    app.controller.activeElement = $(document.activeElement).attr('id');
    app.simulation.simulate.message = app.message.simulate();
    $('.disableOnRunning').toggleClass('disabled', true)
    // $('select').prop('disabled', true);
    $('.disableNode').prop('disabled', true);
    $('.disableLink').prop('disabled', true);
    $('.paramVal').attr('readonly', true);
    $('.sliderInput').slider('disable');
}

simulate.end = () => {
    if (app.simulation.running) return
    app.simulation.simulate.message.close();
    $('.disableOnRunning').toggleClass('disabled', false)
    // $('select:not(.disabled)').prop('disabled', false);
    $('.disableNode').prop('disabled', false);
    $('.disableLink').prop('disabled', false);
    $('.paramVal').attr('readonly', false);
    $('.sliderInput').slider('enable');
}

module.exports = simulate;
