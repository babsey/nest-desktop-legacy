"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');

var s = require("./slider");
var req = require('./request')
var scatterChart = require('./scatter-chart')

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')

d3Request.csv('file://' + curpath + '/settings/models.csv', function(models) {
    models.forEach(function(model) {
        $("<option class='model_select' value=" + model.id + ">" + model.label + "</option>").appendTo("#id_" + model.type)
    })
})


function paramSlider(ref, id, level, label, options) {
    $('#' + ref).find('.params').append('<span class="paramSlider level_' + level + '"><dt id="id_' + id + '">' + label + '</dt></div>')
    return s.slider(id, options);
}

paramSlider('level', 'level', 0, 'Level of configuration', {
    value: 1,
    min: 1,
    max: 4,
    step: 1
}).on('slideStop', function(d) {
    $('.paramSlider').hide()
    for (var i = 0; i <= d.value; i++) {
        $('.level_' + i).show()
    }
})

function simulate(simtime) {
    if (('neuron' in nodes) && ('input' in nodes)) {
        req.simulate('spike_activity', simtime, nodes)
            .done(function(res) {
                data = res
                chart.update(data.events['times'], data.events['senders'])
                    .xlim([data.time-1000,data.time])
                    .ylim([0, data.pop.length]);
            })
    }
}

var update_params = function(node, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, s.row, function(params) {
        params.forEach(function(p) {
            var pslider = paramSlider(node, p.id, p.level, p.label, p.options);
            pslider.on("slideStop", function(d) {
                nodes[node]['params'][p.id] = d.value;
                simulate(1500.)
            })
            nodes[node]['params'][p.id] = pslider.slider('getValue');
            if (p.level > $('#levelInput').attr('value')) {
                $('#' + p.id).parent().attr('style', 'display: none')
            }
        })
    })
}

nodes = {};
$('.model .model_select').on('change', function() {
    var node = $(this).parents('.model').attr('id');
    $('#' + node).find('.params').empty();
    var model = this.value;
    nodes[node] = {
        'model': model,
        'params': {}
    }
    update_params(node, model);
    simulate(1500.)
})

chart = scatterChart('#chart')
    .xlabel('Time (ms)')
    .ylabel('Neuron ID');
