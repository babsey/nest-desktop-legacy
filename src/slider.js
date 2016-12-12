"use strict"

var $ = require("jquery");
var Slider = require("bootstrap-slider");

function slider(name, options) {

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

function paramSlider(nodes, node, param, options) {
    nodes[node]['params'][param] = options.value;

    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
    };
    var options = $.extend(options_default, options);
    $('#id_' + param).after(
        '<dd id=' + param + ' class="' + param + '"><input id="' + param + 'Input" class="slider paramSlider"> <span id="' + param + 'Val" style="margin-left:10px">' + options.value + '</span></dd>'
    );

    var slider = $("#" + param + 'Input').slider(options);
    slider.on("change", function() {
        options.value = $("#" + param + 'Input').val();
        $("#" + param + "Val").text(options.value);
        nodes[node]['params'][param] = options.value;
    });
    return slider
}

$(document)
    .bind("ajaxSend", function() {
        $("input.paramSlider").slider("disable");
    })
    .bind("ajaxComplete", function() {
        $("input.paramSlider").slider("enable");
    })

module.exports = {
    iaf_slider: iaf_slider,
    paramSlider: paramSlider,
    slider: slider
};
