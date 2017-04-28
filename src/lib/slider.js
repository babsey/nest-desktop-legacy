"use strict"

const Slider = require("bootstrap-slider");

var slider = {};

function _slider(ref, id, options) {
    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
        show_value: true,
        natural_arrow_keys: true,
        focus: true,
    };
    var options = $.extend(options_default, options);
    $(ref).find('#' + id).append('<div class="form-group row"></div>')
    var formGroup = $(ref).find('#' + id).find('.form-group')
    formGroup.append('<label for="' + id + 'Val" style="padding-left:15px;min-width: 200px;">'+ options.label +'</label>')
    formGroup.append('<div class="col-md-9"><input id="' + id + 'Input" class="sliderInput"></div>')
    formGroup.append('<div class="col-md-3" style="padding-left:5px"><input data-schema="number" type="text" id="' + id + 'Val" class="paramVal form-control" value="'+ options.value +'"/></div>')
    formGroup.append('<div class="help-block" style="padding-left:15px"></div>')

    var slider = $(ref).find('#' + id).find("#" + id + 'Input').slider(options);
    slider.on("change", function() {
        options.value = $(ref).find('#' + id).find("#" + id + 'Input').val();
        if (!(Object.prototype.toString.call(options.value) === '[object Array]') && (options.show_value)) {
            $(ref).find('#' + id).find("#" + id + "Val").val(options.value);
        }
        app.lastSliderChanged = $(ref).find('#' + id)
    });
    // $(ref).find('#' + id).find(".slider-handle").on("mouseover", function() {
    //     $(this).focus();
    // });
    return slider
}

function _update_dataSlider(id, value) {
    var level = app.config.app().simulation.level;
    $('#' + id).attr('level') > level ? $('#' + id).hide() : $('#' + id).show()
    $('#' + id + 'Input').slider('setValue', value)
    $('#' + id + 'Val').val(value)
}

slider.update_dataSlider = function() {
    var ds = $('.dataSlider');
    var level = app.config.app().simulation.level;
    ds.each(function() {
        var pid = this.id;
        $('#' + this.id).attr('level') > level ? $('#' + pid).hide() : $('#' + pid).show()
    })
}

slider.update_kernelSlider = function(model) {
    var ref = $("#kernel .content");
    var modelSlider = ref.find('.' + model);
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(app.data.kernel[pid]));
            modelSlider.find('#' + pid + 'Val').val(app.data.kernel[pid]);
        } else {
            node.params[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
}

slider.update_nodeSlider = function(node) {
    var modelSlider = $('#nodes .node[data-id=' + node.id + '] .modelSlider');
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(node.params[pid]));
            modelSlider.find('#' + pid + 'Val').val(node.params[pid]);
        } else {
            node.params[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    var colors = app.chart.colors();
    modelSlider.find('.slider-selection').css('background', colors[node.id % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[node.id % colors.length])
}

slider.update_connSlider = function(link) {
    if (link.conn_spec == undefined) return
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    var modelSlider = $('#connections .link[data-id=' + link.id + ']');
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.conn_spec[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(link.conn_spec[pid]));
            modelSlider.find('#' + pid + 'Val').val(link.conn_spec[pid]);
        } else {
            link.conn_spec[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    var colors = app.chart.colors();
    modelSlider.find('.slider-selection').css('background', colors[link.source % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])

}

slider.update_synSlider = function(link) {
    var synModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
    var modelSlider = $('#synapses .link[data-id=' + link.id + ']');
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.syn_spec[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(link.syn_spec[pid]));
            modelSlider.find('#' + pid + 'Val').val(link.syn_spec[pid]);
        } else {
            link.syn_spec[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    var colors = app.chart.colors();
    modelSlider.find('.slider-selection').css('background', colors[link.source % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])

}

slider.update_slider = function() {
    app.data.nodes.map(function(node) {
        slider.update_nodeSlider(node)
    })
    app.data.links.map(function(link) {
        slider.update_connSlider(link)
        slider.update_synSlider(link)
    })
}

slider.create_dataSlider = function(ref, id, options) {
    $(ref).append('<div id="' + id + '" class="dataSlider" level="' + options.level + '"></div>')
    var level = app.config.app().simulation.level;
    $('#' + id).attr('level') > level ? $('#' + id).hide() : $('#' + id).show()
    return _slider(ref, id, options);
}

var create_modelSlider = function(ref, id, options) {
    $(ref).append('<div id="' + id + '" class="paramSlider ' + ((id.indexOf('__') != -1) ? 'nested' : '') + '" level="' + options.level + '"></div>')
    return _slider(ref, id, options);
}

slider.init_modelSlider = function(ref, model) {
    $(ref).empty()
    $(ref).append('<div class="model ' + model.id + '"></div>')
    for (var idx in model.sliderDefaults) {
        var p = model.sliderDefaults[idx];
        var options = {
            value: +p.value,
            label: p.label,
            level: +p.level,
            min: +p.min,
            max: +p.max,
            step: +p.step,
            scale: p.scale || 'linear'
        }
        create_modelSlider(ref + ' .' + model.id, p.id, options);
    }
}

module.exports = slider;
