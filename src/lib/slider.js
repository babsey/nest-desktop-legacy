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

function _update_dataSlider(id, value) {
    var level = app.config.app().get('simulation.level');
    $('#' + id).attr('level') > level ? $('#' + id).hide() : $('#' + id).show()
    $('#' + id + 'Input').slider('setValue', value)
    $('#' + id + 'Val').html(value)
}

slider.update_dataSlider = function() {
    var ds = $('.dataSlider');
    var level = app.config.app().get('simulation.level');
    ds.each(function() {
        var pid = this.id;
        $('#' + this.id).attr('level') > level ? $('#' + pid).hide() : $('#' + pid).show()
    })
}

slider.update_kernelSlider = function() {
    var ref = $("#kernel .content");
    var modelSlider = ref.find('.' + model);
    var level = app.config.app().get('simulation.level');
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (node.params[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(app.data.kernel[pid]));
            modelSlider.find('#' + pid + 'Val').html(app.data.kernel[pid]);
        } else {
            node.params[pid] = modelSlider.find('#' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
}

slider.update_nodeSlider = function(node) {
    var modelSlider = $('#nodes .node[data-id=' + node.id + '] .modelSlider');
    var level = app.config.app().get('simulation.level');
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
    var colors = app.chart.colors();
    modelSlider.find('.slider-selection').css('background', colors[node.id % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[node.id % colors.length])
}

slider.update_connSlider = function(link) {
    if (link.conn_spec == undefined) return
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
    var modelSlider = $('#connections .link[data-id=' + link.id + ']');
    var level = app.config.app().get('simulation.level');
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.conn_spec[pid] != undefined) {
            modelSlider.find('#' + pid + 'Input').slider('setValue', parseFloat(link.conn_spec[pid]));
            modelSlider.find('#' + pid + 'Val').html(link.conn_spec[pid]);
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
    var level = app.config.app().get('simulation.level')
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
    var colors = app.chart.colors();
    modelSlider.find('.slider-selection').css('background', colors[link.source % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])

}

slider.create_dataSlider = function(ref, id, options) {
    $(ref).append('<dl id="' + id + '" class="dataSlider" level="' + options.level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + options.label + '</dt>')
    var level = app.config.app().get('simulation.level');
    $('#' + id).attr('level') > level ? $('#' + id).hide() : $('#' + id).show()
    return _slider(ref, id, options);
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

slider.init_popSlider = function(node, options) {
    slider.create_dataSlider('.node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', function(d) {
            app.data.nodes[node.id].n = d.value
        })
}

slider.init_stimSlider = function(node, options) {
    slider.create_dataSlider('.node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', function(d) {
            console.log(d.value)
            node.params.start = d.value[0]
            delete node.params.stop
            if (d.value[1] < app.data.sim_time) {
                node.params.stop = d.value[1]
            }
        })
}

slider.init_binSlider = function(node, options) {
    slider.create_dataSlider('.node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', function(d) {
            app.data.nodes[node.id].nbins = options.ticks_labels[d.value]
        })
}

var create_modelSlider = function(ref, id, options) {
    $(ref).append('<dl id="' + id + '" class="paramSlider" level="' + options.level + '"></dl>')
    $(ref).find('#' + id).append('<dt>' + options.label + '</dt>')
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
            level: p.level,
            min: +p.min,
            max: +p.max,
            step: +p.step,
            scale: p.scale || 'linear'
        }
        create_modelSlider(ref + ' .' + model.id, p.id, options);
    }
}

module.exports = slider;
