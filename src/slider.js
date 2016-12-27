"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');
var Slider = require("bootstrap-slider");

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')

function slider(ref, id, options) {
    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
    };
    var options = $.extend(options_default, options);
    $(ref).find('#' + id).find('dt').after('<dd></dd>');
    $(ref).find('#' + id).find('dd').append('<input id="' + id + 'Input" class="sliderInput">')
    $(ref).find('#' + id).find('dd').append('<span id="' + id + 'Val" style="margin-left:10px">' + options.value + '</span>')

    var slider = $(ref).find('#' + id).find("#" + id + 'Input').slider(options);
    slider.on("change", function() {
        options.value = $(ref).find('#' + id).find("#" + id + 'Input').val();
        $(ref).find('#' + id).find("#" + id + "Val").text(options.value);
    });
    return slider
}

function paramSlider(ref, id, level, label, options) {
    $(ref).find('.params').append('<span id="' + id + '" class="paramSlider" level="' + level + '"></span>')
    $(ref).find('.params').find('#' + id).append('<dt>' + label + '</dt>')
    return slider('.params', id, options);
}

function modelSlider(ref, id, level, label, options) {
    $(ref).append('<span id="' + id + '" class="paramSlider" level="' + level + '"></span>')
    $(ref).find('#' + id).append('<dt>' + label + '</dt>')
    return slider(ref, id, options);
}

function create_paramslider(data, options) {
    var options_default = {
        simtime: {
            value: data.simtime,
            min: 100,
            max: 2000,
            step: 100,
        },
        npop: {
            value: data.nodes.neuron.npop,
            min: 1,
            max: 500,
            step: 1,
        },
        outdegree: {
            value: data.nodes.neuron.outdegree,
            min: 0,
            max: 100,
            step: 2
        }
    }
    var options = $.extend(options_default, options)

    paramSlider('#simtime', 'simtime', 0, 'Simulation time (ms)', options.simtime)
        .on('slideStop', function(d) {
            data.simtime = d.value;
        })

    paramSlider('#npop', 'npop', 0, 'Population size', options.npop)
        .on('slideStop', function(d) {
            data.nodes.neuron.npop = d.value;
        })

    paramSlider('#outdegree', 'outdegree', 0, 'Outdegree (%)', options.outdegree)
        .on('slideStop', function(d) {
            data.nodes.neuron.outdegree = d.value;
        })
}

function update_paramslider(data) {
    $('#simtimeInput').slider('setValue', data.simtime)
    $('#simtimeVal').html(data.simtime)
    $('#npopInput').slider('setValue', data.nodes.neuron.npop)
    $('#npopVal').html(data.nodes.neuron.npop)
    $('#outdegreeInput').slider('setValue', data.nodes.neuron.outdegree)
    $('#outdegreeVal').html(data.nodes.neuron.outdegree)
}

function row(p) {
    return {
        id: p.id,
        label: p.label,
        level: p.level,
        options: {
            value: +p.value,
            min: +p.min,
            max: +p.max,
            step: +p.step
        }
    }
}

function create_modelslider(nodes, node, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, row, function(ps) {
        $('#' + node).find('.params').append('<span id="' + model + '" class="modelSlider">')
        ps.forEach(function(p) {
            var pslider = modelSlider('#' + model, p.id, p.level, p.label, p.options);
            pslider.on("slideStop", function(d) {
                nodes[node].params[p.id] = d.value;
            })
        })
    })
}

function update_modelslider(nodes, node, model, level, params) {
    $('#' + node).find('.modelSlider').hide();
    if (params == undefined) {
        var ps = $('#' + model).find('.paramSlider');
        ps.each(function() {
            var pid = this.id;
            nodes[node].params[pid] = $('#' + model).find('#' + pid + 'Input').slider('getValue');
            // $('#' + model).find('#' + pid).attr('style', 'display: ' + ($('#' + pid).attr('level') > level ? 'none' : 'visible'))
            $('#' + model).find('#' + pid).attr('level') > level ? $('#' + model).find('#' + pid).hide() : $('#' + model).find('#' + pid).show()
        })
    } else {
        for (var pid in nodes[node].params) {
            var val = nodes[node].params[pid];
            $('#' + model).find('#' + pid + 'Input').slider('setValue', val);
            $('#' + model).find('#' + pid + 'Val').html(val);
            $('#' + model).find('#' + pid).attr('level') > level ? $('#' + model).find('#' + pid).hide() : $('#' + model).find('#' + pid).show()
        }
    }
    $('#' + node).find('#' + model).show();
}


module.exports = {
    slider: slider,
    paramSlider: paramSlider,
    create_paramslider: create_paramslider,
    update_paramslider: update_paramslider,
    create_modelslider: create_modelslider,
    update_modelslider: update_modelslider,
};
