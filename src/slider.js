"use strict"

var $ = require("jquery");
var Slider = require("bootstrap-slider");

function slider0(name, options) {

    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
    };
    var options = $.extend(options_default, options);
    $('#' + name).after(
        '<dd><input id="' + name + 'Input" class="slider"> <span id="' + name + 'Val" class="' + name + '" style="margin-left:10px">' + options.value + '</span></dd>'
    );

    var slider = new Slider("#" + name + 'Input', options);
    slider.on("change", function() {
        options.value = $("#" + name + 'Input').val();
        $("#" + name + "Val").text(options.value);
    });
    return slider
}

function iaf_slider(nodes, param, options) {
    nodes[param] = options.value;

    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
    };
    var options = $.extend(options_default, options);
    $('#' + param).after(
        '<dd><input id="' + param + 'Input"> <span id="' + param + 'Val" style="margin-left:10px">' + options.value + '</span></dd>'
    );

    var slider = new Slider("#" + param + 'Input', options);
    slider.on("change", function() {
        options.value = $("#" + param + 'Input').val();
        $("#" + param + "Val").text(options.value);
        nodes[param] = options.value;
    });
}

function slider(param, options) {
    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
    };
    var options = $.extend(options_default, options);
    $('#id_' + param).after(
        '<dd id=' + param + ' class="' + param + '"><input id="' + param + 'Input" class="slider"> <span id="' + param + 'Val" style="margin-left:10px">' + options.value + '</span></dd>'
    );

    var slider = $("#" + param + 'Input').slider(options);
    slider.on("change", function() {
        options.value = $("#" + param + 'Input').val();
        $("#" + param + "Val").text(options.value);
    });
    return slider
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

$(document)
    .bind("ajaxSend", function() {
        $("input.slider").slider("disable");
    })
    .bind("ajaxComplete", function() {
        $("input.slider").slider("enable");
    })

module.exports = {
    slider: slider,
    row: row
};
