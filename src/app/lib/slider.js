"use strict"

const $ = require("jquery");
const Slider = require("bootstrap-slider");
var config = require('../config');
var settings = config.global();

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
    $('#' + id).attr('level') > settings.get('level') ? $('#' + id).hide() : $('#' + id).show()
    return slider(ref, id, options);
}

function update_dataSlider(id, value) {
    $('#' + id).attr('level') > settings.get('level') ? $('#' + id).hide() : $('#' + id).show()
    $('#' + id + 'Input').slider('setValue', value)
    $('#' + id + 'Val').html(value)
}

function update_dataSlider_level() {
    var ds = $('.dataSlider');
    ds.each(function() {
        var pid = this.id;
        $('#' + this.id).attr('level') > settings.get('level') ? $('#' + pid).hide() : $('#' + pid).show()
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
    $(ref).append('<div class="'+ model.id +' modelSlider" style="display:none"></div>')
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
        modelSlider.find('#' + pid).attr('level') > settings.get('level') ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    ref.find('.' + model).show();
}


module.exports = {
    create_dataSlider: create_dataSlider,
    update_dataSlider: update_dataSlider,
    update_dataSlider_level: update_dataSlider_level,
    init_paramSlider: init_paramSlider,
    update_paramSlider: update_paramSlider,
};
