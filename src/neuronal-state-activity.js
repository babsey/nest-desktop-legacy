"use strict"

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var d3Request = require('d3-request');
var d3Array = require('d3-array')

// var data, chart, times, values, simulate;
var models = require("./models");
var slider = require("./slider");
var req = require('./request');
var nav = require('./navigation');
var lineChart = require('./line-chart');

data = {
    simtime: 1000.,
    level: 1,
    nodes: {
        neuron: {
            npop: 10,
            outdegree: 10,
            record_from: 'V_m',
            model: undefined,
            params: {},
        },
        input: {
            model: undefined,
            params: {},
        }
    }
}

simulate = function() {
    setTimeout(function() {
        if ((data.nodes.neuron.model == undefined) || (data.nodes.input.model == undefined)) return
        var sendData = {
            simtime: data.simtime,
            nodes: data.nodes,
        }
        req.simulate('neuronal_state_activity', sendData)
            .done(function(res) {
                data.events = res.events;
                data.curtime = res.curtime;
                data.nodes.neuron.pop = res.nodes.neuron.pop;
                var pop = data.nodes.neuron.pop;
                var npop = data.nodes.neuron.npop
                times = data.events.times.filter(function(d, i) {
                    return i % npop == 0
                });
                values = pop.map(function() {
                    return []
                });
                data.events[data.nodes.neuron.record_from].map(function(d, i) {
                    values[i % npop].push(d)
                });

                chart.data({
                        x: times,
                        y: values
                    })
                    .xlim(d3Array.extent(times))
                    .ylim(d3Array.extent([].concat.apply([], values)))
                    .ylabel(models.record_labels[data.nodes.neuron.record_from])
                    .update();
            })
    }, 100)
}

$('#id_record').on('change', function() {
    data.nodes.neuron.record_from = this.value;
    var pop = data.nodes.neuron.pop;
    var npop = pop.length;

    values = pop.map(function() {
        return []
    });
    data.events[data.nodes.neuron.record_from].map(function(d, i) {
        values[i % npop].push(d)
    });

    chart.data({
            x: times,
            y: values
        })
        .ylabel(models.record_labels[data.nodes.neuron.record_from])
        .update();
})


slider.create_paramslider(data, {'npop': {max: 10, min: 1}})
models.load_model_list(data.nodes)
models.model_select_onChange(data.nodes, data.level)
nav.init_button(data, 'neuronal_state_activity')

setTimeout(function() {
    $('.sliderInput').on('slideStop', simulate)
    $('.model_select').on('change', function() {
        var node = $(this).parents('.model').attr('id');
        var model = this.value;
        slider.update_modelslider(data.nodes, node, model, data.level)
        simulate()
    })
    $('.network').on('click', simulate)
}, 100)

$('#network-add-submit').on('click', function() {
    setTimeout(function() {
        nav.get_network_list(data, 'neuronal_state_activity')
        setTimeout(function() {
            $('.network').on('click', simulate)
        }, 100)
    }, 100)
})

chart = lineChart('#chart')
    .xlabel('Time (ms)');
