"use strict"

var resume = {};

resume.run = () => {
    if (!(app.simulation.running)) return
    var chart = app.graph.chart;

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
                app.message.show('NEST Error', response.error)
                app.simulation.simulate.end()
                return
            }
            if (!app.simulation.running) return
            app.data.kernel.time = response.data.kernel.time;
            if ($('#autoscale').prop('checked')) {
                chart.xScale.domain([app.data.kernel.time - (app.data.sim_time), app.data.kernel.time])
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
                chart.data.times = recorder.events.times.filter((d, i) => {
                    return ((recorder.events.senders[i] == recorder.senders[0]))
                })
            })
            app.graph.update()
            app.controller.update()
            resume.run()
        })
}

resume.update = () => {
    $('.disableOnRunning').toggleClass('disabled', app.simulation.running)
    $('.dataSlider').find('.sliderInput').slider(app.simulation.running ? 'disable' : 'enable')
    $('#connections').find('.sliderInput').slider(app.simulation.running ? 'disable' : 'enable')
    if (app.simulation.running) {
        app.message.log('The simulation is running continuously.')
        resume.message = app.message.resume()
    }
}

resume.pause = () => {
    if (resume.message) {
        resume.message.close()
    }
    app.simulation.running = false;
    resume.update()
}

resume.start = () => {
    app.simulation.running = true;
    resume.update()
    resume.run()
}

resume.slider = () => {
    var model = {
        "id": "res_time",
        "label": "Simulation time step (ms)",
        "level": 2,
        "min": 1.0,
        "max": 20.0,
        "step": 1.0,
        "value": 10.0
    };
    app.slider.create_dataSlider('#message-resume .content', model.id, model)
        .on('slideStop', function(d) {
            app.data.res_time = d.value
        })
    $('#message-resume').find('input.paramVal').on('change', function() {
        var value = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(value, schema)
        if (valid.error != null) return
        app.data.res_time = valid.value;
        $('.res_timeInput').slider('setValue', parseFloat(valid.value));
    })
}


module.exports = resume;
