"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');
var Slider = require("bootstrap-slider");

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')

var selected_node = null,
    selected_link = null;

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
        grng_seed: {
            value: data.kernel.grng_seed,
            min: 0,
            max: 1000,
            step: 1
        },
        npop: {
            value: data.nodes[0].npop,
            min: 1,
            max: 500,
            step: 1,
        },
        outdegree: {
            value: data.nodes[0].outdegree,
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

    paramSlider('#grng_seed', 'grng_seed', 0, 'Random number generated seed', options.grng_seed)
        .on('slideStop', function(d) {
            data.kernel.grng_seed = d.value;
        })

    paramSlider('#npop', 'npop', 0, 'Population size', options.npop)
        .on('slideStop', function(d) {
            data.nodes[0].npop = d.value;
        })

    paramSlider('#outdegree', 'outdegree', 0, 'Outdegree (%)', options.outdegree)
        .on('slideStop', function(d) {
            data.nodes[0].outdegree = d.value;
        })
}

function update_paramslider(data) {
    $('#simtimeInput').slider('setValue', data.simtime)
    $('#simtimeVal').html(data.simtime)
    $('#grng_seedInput').slider('setValue', data.kernel.grng_seed)
    $('#grng_seedVal').html(data.kernel.grng_seed)
    $('#npopInput').slider('setValue', data.nodes[0].npop)
    $('#npopVal').html(data.nodes[0].npop)
    $('#outdegreeInput').slider('setValue', data.nodes[0].outdegree)
    $('#outdegreeVal').html(data.nodes[0].outdegree)
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

function create_modelslider(type, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, row, function(ps) {
        $('#' + type).find('.params').append('<span id="' + model + '" class="modelSlider">')
        ps.forEach(function(p) {
            var pslider = modelSlider('span#' + model, p.id, p.level, p.label, p.options);
        })
    })
}

function update_modelslider(node, level, params) {
    var model = node.model;
    $('option#'+model).prop('selected', true);
    $('#' + node.type).find('.modelSlider').hide();
    if (params == undefined) {
        var ps = $('span#' + model).find('.paramSlider');
        ps.each(function() {
            var pid = this.id;
            node.params[pid] = $('span#' + model).find('#' + pid + 'Input').slider('getValue');
            $('span#' + model).find('#' + pid).attr('level') > level ? $('span#' + model).find('#' + pid).hide() : $('span#' + model).find('#' + pid).show()
        })
    } else {
        for (var pid in params) {
            var val = params[pid];
            $('span#' + model).find('#' + pid + 'Input').slider('setValue', val);
            $('span#' + model).find('#' + pid + 'Val').html(val);
            $('span#' + model).find('#' + pid).attr('level') > level ? $('span#' + model).find('#' + pid).hide() : $('span#' + model).find('#' + pid).show()
        }
    }
    $('span#' + model).show();
}


module.exports = {
    slider: slider,
    paramSlider: paramSlider,
    create_paramslider: create_paramslider,
    update_paramslider: update_paramslider,
    create_modelslider: create_modelslider,
    update_modelslider: update_modelslider,
};
