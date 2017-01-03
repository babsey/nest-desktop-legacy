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
        model: 'iaf_cond_alpha',
        params: {
            'C_m': 200.0,
            'E_L': -80.0,
            'E_ex': 0.0,
            'E_in': -64.0,
            'V_reset': -80.0,
            'V_th': -45.0,
            'g_L': 12.5,
            't_ref': 2.0,
            'tau_minus': 20.0,
            'tau_syn_ex': 5.0,
            'tau_syn_in': 10.0,
        },
        npop: 400,
        nrow: 20,
        ncol: 20,
        outdegree: 50,
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
    req.simulate('bump_activity', sendData)
        .done(function(res) {
            data.events = res.events;
            data.curtime = res.curtime;
            data.nodes[0].pop = res.nodes[0].pop;
            data.nodes[0].nrow = res.nodes[0].nrow;
            data.nodes[0].ncol = res.nodes[0].ncol;

            var h1 = d3Array.histogram()
                .domain([1,data.nodes[0].pop.length+1])
                .thresholds(data.nodes[0].pop)(data.events['senders']);
            var h1 = h1.map(function (d) {return d.length*1})

            chart.data({
                    y: d3Array.range(0, data.nodes[0].nrow),
                    x: d3Array.range(0, data.nodes[0].ncol),
                    c: h1,
                })
                .xlim([0, data.nodes[0].nrow])
                .ylim([0, data.nodes[0].ncol])
                .clim([0, 50])
                .update();
        })
}

slider.create_paramslider(data)
models.load_model_list(data.nodes)
nav.init_button(data, 'bump_activity')

setTimeout(function() {
    $('.modelSlider .sliderInput').on('slideStop', function() {
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
        selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
    })
    $('.sliderInput').on('slideStop', function() {
        setTimeout(simulate, 100)
    })
    $('.modelSelect').on('change', function() {
        var model = this.value;
        selected_node = data.nodes[$(this).parents('.model').attr('nidx')];
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
        nav.get_network_list(data, 'bump_activity')
        $('.network').on('click', function() {
            setTimeout(simulate, 100)
        })
    }, 100)
})

chart = heatmapChart('#chart')
    .xlabel('Neuron Row ID')
    .ylabel('Neuron Col ID');
