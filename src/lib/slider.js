"use strict"

const Slider = require("bootstrap-slider");

function _slider(ref, id, options) {
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

var slider = {};

slider.create_dataSlider = function(ref, id, options) {
    $(ref).append('<dl id="' + id + '" class="dataSlider" level="' + options.level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + options.label + '</dt>')
    $('#' + id).attr('level') > app.config.app().get('level') ? $('#' + id).hide() : $('#' + id).show()
    return _slider(ref, id, options);
}

function _update_dataSlider(id, value) {
    $('#' + id).attr('level') > app.app.app().get('level') ? $('#' + id).hide() : $('#' + id).show()
    $('#' + id + 'Input').slider('setValue', value)
    $('#' + id + 'Val').html(value)
}

slider.init_globalSlider = function(options) {
    slider.create_dataSlider('#global .content', options.id, options)
        .on('slideStop', function(d) {
            app.data[options.id] = d.value
        })
}

slider.init_kernelSlider = function(options) {
    slider.create_dataSlider('#kernel .content', options.id, options)
        .on('slideStop', function(d) {
            app.data.kernel[options.id] = d.value
        })
}

slider.init_popSlider = function(nidx, options) {
    slider.create_dataSlider('#node_' + nidx +' .content', options.id, options)
        .on('slideStop', function(d) {
            app.data.nodes[nidx].n = d.value
        })
}

slider.init_binSlider = function(nidx, options) {
    slider.create_dataSlider('#node_' + nidx +' .content', options.id, options)
        .on('slideStop', function(d) {
            app.data.nodes[nidx].nbins = options.ticks_labels[d.value]
        })
}


slider.update_dataSlider_level = function() {
    var ds = $('.dataSlider');
    ds.each(function() {
        var pid = this.id;
        $('#' + this.id).attr('level') > app.config.app().get('level') ? $('#' + pid).hide() : $('#' + pid).show()
    })
}

//
// slider for parameter values of a model
//


var create_modelSlider = function(ref, id, options) {
    $(ref).append('<dl id="' + id + '" class="paramSlider" level="' + options.level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + options.label + '</dt>')
    return _slider(ref, id, options);
}

slider.init_modelSlider = function(ref, model) {
    $(ref).empty()
    $(ref).append('<div class="model ' + model.id + '" style="display:none"></div>')
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
        create_modelSlider(ref + ' .' + model.id, p.id, options);
    }
}

slider.update_kernelSlider = function() {
    var ref = $("#kernel .content");
    var modelSlider = ref.find('.' + model);
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(app.data.kernel[pid]));
            modelSlider.find('#' + pid + 'Val').html(app.data.kernel[pid]);
        } else {
            node.params[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > app.config.app().get('level') ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
}

slider.update_nodeSlider = function(node) {
    var ref = $("#node_" + node.id);
    var model = node.model;
    ref.find('.modelSlider .model').hide();
    var modelSlider = ref.find('.' + model);
    var level = app.config.app().get('level')
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(node.params[pid]));
            modelSlider.find('#' + pid + 'Val').html(node.params[pid]);
        } else {
            node.params[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    ref.find('.' + model).show();
}

slider.update_connSlider = function(link) {
    if (link.conn_spec == undefined) return
    var rule = link.conn_spec.rule || 'all_to_all';
    var ref = $("#conn_" + link.id);
    ref.find('.connSlider .model').hide();
    var ruleSlider = ref.find('.' + rule);
    var level = app.config.app().get('level')
    ruleSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.conn_spec[pid] != undefined) {
            ruleSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(link.conn_spec[pid]));
            ruleSlider.find('#' + pid + 'Val').html(link.conn_spec[pid]);
        } else {
            link.conn_spec[pid] = ruleSlider.find('#' + pid + 'Input').slider('getValue')
        }
        ruleSlider.find('#' + pid).attr('level') > level ? ruleSlider.find('#' + pid).hide() : ruleSlider.find('#' + pid).show()
    })
    ref.find('.' + rule).show();
}

slider.update_synSlider = function(link) {
    if (link.syn_spec == undefined) return
    var model = link.syn_spec.model || 'static_synapse';
    var ref = $("#syn_" + link.id);
    ref.find('.synSlider .model').hide();
    var modelSlider = ref.find('.' + model);
    var level = app.config.app().get('level')
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.syn_spec[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(link.syn_spec[pid]));
            modelSlider.find('#' + pid + 'Val').html(link.syn_spec[pid]);
        } else {
            link.syn_spec[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    ref.find('.' + model).show();
}

module.exports = slider;
