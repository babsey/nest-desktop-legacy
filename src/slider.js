"use strict"

const $ = require("jquery");
const Slider = require("bootstrap-slider");
var config = require('./config');
var settings = config.global();

function slider(ref, id, options) {
    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
    };
    var options = $.extend(options_default, options);
    $(ref).find('#' + id).find('dt').attr('title', id)
    $(ref).find('#' + id).find('dt').after('<dd></dd>');
    $(ref).find('#' + id).find('dd').append('<input id="' + id + 'Input" class="sliderInput">')

    if (!(Object.prototype.toString.call(options.value) === '[object Array]')) {
        $(ref).find('#' + id).find('dd').append('<span id="' + id + 'Val" style="margin-left:10px">' + options.value + '</span>')
    }

    var slider = $(ref).find('#' + id).find("#" + id + 'Input').slider(options);
    slider.on("change", function() {
        options.value = $(ref).find('#' + id).find("#" + id + 'Input').val();
        if (!(Object.prototype.toString.call(options.value) === '[object Array]')) {
            $(ref).find('#' + id).find("#" + id + "Val").text(options.value);
        }
    });
    return slider
}

//
// slider for data values
//

function create_dataSlider(ref, id, level, label, options) {
    $(ref).append('<dl id="' + id + '" class="dataSlider" level="' + level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + label + '</dt>')
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


function create_paramSlider(ref, id, level, label, options) {
    $(ref).append('<dl id="' + id + '" class="paramSlider" level="' + level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + label + '</dt>')
    return slider(ref, id, options);
}

function init_paramSlider(model) {
    $('#' + model.type).find('.params').append('<div id="' + model.id + '" class="modelSlider"></div>')
    for (var idx in model.sliderDefaults) {
        var p = model.sliderDefaults[idx];
        var options = {
            value: +p.value,
            min: +p.min,
            max: +p.max,
            step: +p.step,
            scale: p.scale || 'linear'
        }
        var pslider = create_paramSlider('div#' + model.id, p.id, p.level, p.label, options);
    }
}

function update_paramSlider(node) {
    var model = node.model;
    $('option#' + model).prop('selected', true);
    $('#' + node.type).find('.paramSlider').hide();
    var ps = $('div#' + model).find('.paramSlider');
    ps.each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            $('div#' + model).find('#' + pid + 'Input').slider('setValue', parseFloat(node.params[pid]));
            $('div#' + model).find('#' + pid + 'Val').html(node.params[pid]);
        } else {
            node.params[pid] = $('div#' + model).find('#' + pid + 'Input').slider('getValue')
        }
        $('div#' + model).find('#' + pid).attr('level') > settings.get('level') ? $('div#' + model).find('#' + pid).hide() : $('div#' + model).find('#' + pid).show()
    })
    $('div#' + model).show();
}


module.exports = {
    create_dataSlider: create_dataSlider,
    update_dataSlider: update_dataSlider,
    update_dataSlider_level: update_dataSlider_level,
    init_paramSlider: init_paramSlider,
    update_paramSlider: update_paramSlider,
};
