"use strict"

var resume = {};

resume.resume = () => {
    if (!(app.simulation.running)) return

    app.request.request({
            id: app.data._id,
            network: app.data.network,
            kernel: app.data.kernel,
            sim_time: app.data.res_time || 10.,
            nodes: app.data.nodes,
            links: app.data.links,
        })
        .done((response) => {
            if (response.error) {
                app.message.show('Warning', response.error, 2000)
                return
            }
            if (!app.simulation.running) return
            app.data.kernel.time = response.data.kernel.time;
            if ($('#autoscale').prop('checked')) {
                app.chart.xScale.domain([app.data.kernel.time - (app.data.sim_time), app.data.kernel.time])
            }
            app.simulation.recorders.map((recorder) => {
                for (var key in response.data.nodes[recorder.node.id].events) {
                    recorder.events[key] = recorder.events[key].concat(response.data.nodes[recorder.node.id].events[key])
                }
                recorder.senders = d3.merge(app.data.links.filter((link) => {
                    return link.target == recorder.node.id
                }).map((link) => {
                    return app.data.nodes[link.source].ids
                }))
                app.chart.data.times = recorder.events.times.filter((d, i) => {
                    return ((recorder.events.senders[i] == recorder.senders[0]))
                })
            })
            app.chart.update()
            app.controller.update()
            app.simulation.resume()
        })
}

module.exports = resume;
