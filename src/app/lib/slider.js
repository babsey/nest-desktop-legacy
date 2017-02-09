"use strict"

const Slider = require("bootstrap-slider");
var config_global = require('../config').global();

function slider(ref, id, options) {
    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
        show_value: true,
    };
    var options = $.extend(options_default, options);
    $(ref).find('#' + id).find('dt').attr('title', id)
    $(ref).find('#' + id).find('dt').after('<dd></dd>');
    $(ref).find('#' + id).find('dd').append('<input id="' + id + 'Input" class="sliderInput">')

    if (!(Object.prototype.toString.call(options.value) === '[object Array]') && (options.show_value)) {
        $(ref).find('#' + id).find('dd').append('<span id="' + id + 'Val" style="margin-left:10px">' + options.value + '</span>')
    }

    var slider = $(ref).find('#' + id).find("#" + id + 'Input').slider(options);
    slider.on("change", function() {
        options.value = $(ref).find('#' + id).find("#" + id + 'Input').val();
        if (!(Object.prototype.toString.call(options.value) === '[object Array]') && (options.show_value)) {
            $(ref).find('#' + id).find("#" + id + "Val").text(options.value);
        }
    });
    return slider
}

//
// slider for data values
//

function create_dataSlider(ref, id, value, options) {
    options.value = value
    $(ref).append('<dl id="' + id + '" class="dataSlider" level="' + options.level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + options.label + '</dt>')
    $('#' + id).attr('level') > config_global.get('level') ? $('#' + id).hide() : $('#' + id).show()
    return slider(ref, id, options);
}

function _update_dataSlider(id, value) {
    $('#' + id).attr('level') > config_global.get('level') ? $('#' + id).hide() : $('#' + id).show()
    $('#' + id + 'Input').slider('setValue', value)
    $('#' + id + 'Val').html(value)
}

function update_dataSlider() {
    var slider_options = config.simulation(simulation).slider_options;
    _update_dataSlider('sim_time', data.sim_time)
    _update_dataSlider('grng_seed', data.kernel.grng_seed)
    _update_dataSlider('stim_time', data.nodes[0].stim_time)
    _update_dataSlider('n', data.nodes[1].n)
    _update_dataSlider('input_weight', data.links[0].syn_spec.weight)
    _update_dataSlider('outdegree', data.links[1].conn_spec.outdegree)
    _update_dataSlider('recurrent_weight', data.links[1].syn_spec.weight)
    if (slider_options.binwidth) {
        _update_dataSlider('binwidth', slider_options.binwidth.ticks_labels.indexOf(data.nodes[2].binwidth))
    }
}

function init_dataSlider() {

    var slider_options = config.simulation(simulation).slider_options;
    if (slider_options.sim_time) {
        create_dataSlider('#global', 'sim_time', data.sim_time, slider_options.sim_time)
            .on('slideStop', function(d) {
                data.sim_time = d.value;
                if (data.nodes[0].stim_time[1] < data.sim_time) {
                    data.nodes[0].params.stop = data.nodes[0].stim_time[1]
                } else {
                    delete data.nodes[0].params.stop
                }
            })
    }
    if (slider_options.grng_seed) {
        create_dataSlider('#global', 'grng_seed', data.kernel.grng_seed, slider_options.grng_seed)
            .on('slideStop', function(d) {
                data.kernel.grng_seed = d.value;
            })
    }
    if (slider_options.stim_time) {
        create_dataSlider('#node_0', 'stim_time', data.nodes[0].stim_time, slider_options.stim_time)
            .on('slideStop', function(d) {
                data.nodes[0].stim_time = d.value;
                data.nodes[0].params.start = d.value[0];
                if (data.nodes[0].stim_time[1] < data.sim_time) {
                    data.nodes[0].params.stop = data.nodes[0].stim_time[1]
                } else {
                    delete data.nodes[0].params.stop
                }
            })
    }
    if (slider_options.input_weight) {
        create_dataSlider('#node_0', 'input_weight', data.links[0].syn_spec.weight, slider_options.input_weight)
            .on('slideStop', function(d) {
                data.links[0].syn_spec.weight = d.value;
            })
    }
    if (slider_options.n) {
        create_dataSlider('#node_1', 'n', data.nodes[1].n, slider_options.n)
            .on('slideStop', function(d) {
                data.nodes[1].n = d.value;
            })
    }
    if (slider_options.outdegree) {
        create_dataSlider('#node_1', 'outdegree', data.links[1].conn_spec.outdegree, slider_options.outdegree)
            .on('slideStop', function(d) {
                data.links[1].conn_spec.outdegree = d.value;
            })
    }
    if (slider_options.recurrent_weight) {
        create_dataSlider('#node_1', 'recurrent_weight', data.links[1].syn_spec.weight, slider_options.recurrent_weight)
            .on('slideStop', function(d) {
                data.links[1].syn_spec.weight = d.value;
            })
    }
    if (slider_options.binwidth) {
        create_dataSlider('#node_2', 'binwidth', slider_options.binwidth.ticks_labels.indexOf(data.nodes[2].binwidth), slider_options.binwidth)
            .on('slideStop', function(d) {
                data.nodes[2].binwidth = slider_options.binwidth.ticks_labels[d.value];
            })
    }
    update_dataSlider()
}

function update_dataSlider_level() {
    var ds = $('.dataSlider');
    ds.each(function() {
        var pid = this.id;
        $('#' + this.id).attr('level') > config_global.get('level') ? $('#' + pid).hide() : $('#' + pid).show()
    })
}

//
// slider for parameter values of a model
//


function create_paramSlider(ref, id, options) {
    $(ref).append('<dl id="' + id + '" class="paramSlider" level="' + options.level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + options.label + '</dt>')
    return slider(ref, id, options);
}

function init_paramSlider(ref, model) {
    $(ref).append('<div class="' + model.id + ' modelSlider" style="display:none"></div>')
    for (var idx in model.sliderDefaults) {
        var p = model.sliderDefaults[idx];
        var options = {
            value: +p.value,
            label: p.label,
            level: p.level,
            min: +p.min,
            max: +p.max,
            step: +p.step,
            scale: p.scale || 'linear'
        }
        var pslider = create_paramSlider(ref + ' .' + model.id, p.id, options);
    }
}

function update_paramSlider(node) {
    var ref = $("#node_" + node.id);
    var model = node.model;
    ref.find('.modelSlider').hide();
    var modelSlider = ref.find('.' + model);
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(node.params[pid]));
            modelSlider.find('#' + pid + 'Val').html(node.params[pid]);
        } else {
            node.params[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > config_global.get('level') ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    ref.find('.' + model).show();
}


module.exports = {
    init_dataSlider: init_dataSlider,
    create_dataSlider: create_dataSlider,
    update_dataSlider: update_dataSlider,
    update_dataSlider_level: update_dataSlider_level,
    init_paramSlider: init_paramSlider,
    update_paramSlider: update_paramSlider,
};
