"use strict"

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var d3Array = require('d3-array');
var d3Request = require('d3-request');

// var data, chart, simulate;
var models = require("./models");
var slider = require("./slider");
var req = require('./request');
var nav = require('./navigation');
var heatmapChart = require('./heatmap-chart');

data = {
    simtime: 1000.,
    level: 1,
    nodes: {
        neuron: {
            npop: 400,
            nrow: 20,
            ncol: 20,
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

                var h = d3Array.histogram()
                    .domain([1,data.nodes.neuron.pop.length+1])
                    .thresholds(data.nodes.neuron.pop)(data.events['senders']);
                var hh = h.map(function (d) {return d.length*1})

                chart.data({
                        y: d3Array.range(0,data.nodes.neuron.nrow),
                        x: d3Array.range(0,data.nodes.neuron.ncol),
                        c: hh,
                    })
                    .xlim([0, data.nodes.neuron.nrow])
                    .ylim([0, data.nodes.neuron.ncol])
                    .clim([0, 50])
                    .legend()
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


chart = heatmapChart('#chart')
    .xlabel('Neuron Col ID')
    .ylabel('Neuron Row ID');
//
