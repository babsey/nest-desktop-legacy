"use strict"

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var d3Request = require('d3-request');

// var data, chart, simulate;
var models = require("./models");
var slider = require("./slider");
var req = require('./request');
var nav = require('./navigation');
var scatterChart = require('./scatter-chart');

data = {
    simtime: 1000.,
    level: 1,
    nodes: {
        neuron: {
            npop: 900,
            outdegree: 50,
            model: 'iaf_cond_alpha',
            params: {
                'C_m':        200.0,
                'E_L':        -80.0,
                'E_ex':         0.0,
                'E_in':       -64.0,
                'V_reset':    -80.0,
                'V_th':       -45.0,
                'g_L':         12.5,
                't_ref':        2.0,
                'tau_minus':   20.0,
                'tau_syn_ex':   5.0,
                'tau_syn_in':  10.0,
            },
        },
        input: {
            model: undefined,
            params: {},
        }
    }
}

function simulate() {
    setTimeout(function() {
        if ((data.nodes.neuron.model == undefined) || (data.nodes.input.model == undefined)) return
        var sendData = {
            simtime: data.simtime,
            nodes: data.nodes,
        }
        req.simulate('bump_activity', sendData)
            .done(function(res) {
                data.events = res.events;
                data.curtime = res.curtime;
                data.nodes.neuron.pop = res.nodes.neuron.pop;
                data.nodes.neuron.nrow = res.nodes.neuron.nrow;
                data.nodes.neuron.ncol = res.nodes.neuron.ncol;

                chart.data({
                        x: data.events['senders'].map(function(d) {return parseInt(d%data.nodes.neuron.ncol)}),
                        y: data.events['senders'].map(function(d) {return parseInt(d/data.nodes.neuron.ncol)}),
                        // x: data.events['times'],
                        // y: data.events['senders'],
                    })
                    .xlim([0, data.nodes.neuron.nrow])
                    .ylim([0, data.nodes.neuron.ncol])
                    .update();
            })
    }, 100)
}

slider.create_paramslider(data)
models.load_model_list(data.nodes)
models.model_select_onChange(data.nodes, data.level)
nav.init_button(data, 'bump_activity')

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
        nav.get_network_list(data, 'bump_activity')
        setTimeout(function() {
            $('.network').on('click', simulate)
        }, 100)
    }, 100)
})

chart = scatterChart('#chart')
    .xlabel('Neuron Row ID')
    .ylabel('Neuron Col ID');
