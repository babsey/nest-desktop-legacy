"use strict"

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var d3Request = require('d3-request');
var d3Array = require('d3-array')

var times, values;
var models = require("./models");
var slider = require("./slider");
var req = require('./request');
var nav = require('./navigation');
var lineChart = require('./line-chart');

selected_node = null;
selected_link = null;

data = {
    kernel: {
        grng_seed: 0,
    },
    simtime: 1000.,
    level: 1,
    nodes: [{
        type: 'neuron',
        model: undefined,
        params: {},
        npop: 1,
        outdegree: 10,
        record_from: 'V_m',
    }, {
        type: 'input',
        model: undefined,
        params: {},
    }]
}

function simulate() {
    if ((data.nodes[0].model == undefined) || (data.nodes[1].model == undefined)) return
    var sendData = {
        kernel: data.kernel,
        simtime: data.simtime,
        nodes: data.nodes,
    }
    req.simulate('neuronal_state_activity', sendData)
        .done(function(res) {
            data.events = res.events;
            data.curtime = res.curtime;
            data.nodes[0].pop = res.nodes[0].pop;
            var pop = data.nodes[0].pop;
            var npop = data.nodes[0].npop;
            times = data.events.times.filter(function(d, i) {
                return i % npop == 0
            });
            values = pop.map(function() {
                return []
            });
            data.events[data.nodes[0].record_from].map(function(d, i) {
                values[i % npop].push(d)
            });

            chart.data({
                    x: times,
                    y: values
                })
                .xlim(d3Array.extent(times))
                .ylim(d3Array.extent([].concat.apply([], values)))
                .ylabel(models.record_labels[data.nodes[0].record_from])
                .update();
        })
}

$('#id_record').on('change', function() {
    data.nodes[0].record_from = this.value;
    var pop = data.nodes[0].pop;
    var npop = pop.length;

    values = pop.map(function() {
        return []
    });
    data.events[data.nodes[0].record_from].map(function(d, i) {
        values[i % npop].push(d)
    });

    chart.data({
            x: times,
            y: values
        })
        .ylim(d3Array.extent([].concat.apply([], values)))
        .ylabel(models.record_labels[data.nodes[0].record_from])
        .update();
})

slider.create_paramslider(data, {
    'npop': {
        max: 10,
        min: 1
    }
})
models.load_model_list(data.nodes)
nav.init_button(data, 'neuronal_state_activity')

setTimeout(function() {
    $('.modelSlider .sliderInput').on('slideStop', function() {
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        var model = this.value;
        selected_node.model = model;
        models.selected_model(selected_node)
        slider.update_modelslider(selected_node, data.level)
        setTimeout(simulate, 100)
    })
    $('.network').on('click', function() {
        setTimeout(simulate, 100)
    })
}, 200)

$('#network-add-submit').on('click', function() {
    setTimeout(function() {
        nav.get_network_list(data, 'neuronal_state_activity')
        setTimeout(function() {
            $('.network').on('click', function() {
                setTimeout(simulate, 100)
            })
        }, 100)
    }, 100)
})

chart = lineChart('#chart')
    .xlabel('Time (ms)');
