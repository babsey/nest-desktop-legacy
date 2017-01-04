"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');
var Slider = require("bootstrap-slider");

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')


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

//
// slider for data values
//

function create_dataSlider(ref, id, level, label, options) {
    $(ref).append('<span id="' + id + '" class="dataSlider" level="' + level + '"></span>')
    $(ref).find('#' + id).append('<dt>' + label + '</dt>')
    return slider(ref, id, options);
}

function update_dataSlider(id, value) {
    $('#' + id + 'Input').slider('setValue', value)
    $('#' + id + 'Val').html(value)
}

//
// slider for parameter values of a model
//


function create_paramSlider(ref, id, level, label, options) {
    $(ref).append('<span id="' + id + '" class="paramSlider" level="' + level + '"></span>')
    $(ref).find('#' + id).append('<dt>' + label + '</dt>')
    return slider(ref, id, options);
}

function init_paramSlider(type, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, row, function(ps) {
        $('#' + type).find('.params').append('<span id="' + model + '" class="modelSlider">')
        ps.forEach(function(p) {
            var pslider = create_paramSlider('span#' + model, p.id, p.level, p.label, p.options);
        })
    })
}

function update_paramSlider(node) {
    var model = node.model;
    $('option#' + model).prop('selected', true);
    $('#' + node.type).find('.paramSlider').hide();
    var ps = $('span#' + model).find('.paramSlider');
    ps.each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            $('span#' + model).find('#' + pid + 'Input').slider('setValue', parseFloat(node.params[pid]));
            $('span#' + model).find('#' + pid + 'Val').html(node.params[pid]);
        } else {
            node.params[pid] = $('span#' + model).find('#' + pid + 'Input').slider('getValue')
        }
        $('span#' + model).find('#' + pid).attr('level') > window.level ? $('span#' + model).find('#' + pid).hide() : $('span#' + model).find('#' + pid).show()
    })
    $('span#' + model).show();
}


module.exports = {
    create_dataSlider: create_dataSlider,
    update_dataSlider: update_dataSlider,
    init_paramSlider: init_paramSlider,
    update_paramSlider: update_paramSlider,
};
