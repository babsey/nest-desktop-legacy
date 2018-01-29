"use strict"

const Slider = require("bootstrap-slider");

var slider = {};

var _slider = (ref, id, options) => {
    var options_default = {
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        tooltip: 'hide',
        show_value: true,
        natural_arrow_keys: true,
    };
    var options = $.extend(options_default, options);
    $(ref).find('#' + id).append('<div class="form-group row"></div>')
    var formGroup = $(ref).find('#' + id).find('.form-group')
    formGroup.append('<label title="' + id + '" style="padding-left:15px;min-width: 200px;">' + options.label + '</label>')
    formGroup.append('<div class="col-md-9"><input class="sliderInput ' + id + 'Input"></div>')
    if (options.show_value) {
        formGroup.append('<div class="col-md-3" style="padding-left:5px">' +
            '<input data-schema="number" type="text" id="' + id + 'Val" ' +
            'class="' + id + 'Val paramVal form-control" value="' + options.value + '"/>' +
            '</div>')
    }
    formGroup.append('<div class="help-block" style="padding-left:15px"></div>')
    if (options.ticks_labels) {
        formGroup.find('.' + id + 'Input').data('ticks_labels', JSON.stringify(options.ticks_labels))
    }

    var slider = $(ref).find('#' + id).find("." + id + 'Input').slider(options);
    slider.on("change", () => {
        if (!options.show_value) return
        if (Object.prototype.toString.call(value) === '[object Array]') return
        var value = $(ref).find('#' + id).find("." + id + 'Input').val();
        $(ref).find('#' + id).find("#" + id + "Val").val(value);
    });
    return slider
}

var _update_dataSlider = (id, value) => {
    var level = app.config.app().simulation.level;
    $('#' + id).attr('level') > level ? $('#' + id).hide() : $('#' + id).show()
    $('.' + id + 'Input').slider('setValue', value)
    $('.' + id + 'Val').val(value)
}

slider.update_dataSlider = () => {
    var ds = $('.dataSlider');
    var level = app.config.app().simulation.level;
    ds.each(function() {
        var dataSlider = $('#' + this.id);
        dataSlider.toggle(dataSlider.attr('level') <= level)
    })
}

slider.update_nodeSlider = (node) => {
    var modelSlider = $('#nodes .node[data-id=' + node.id + '] .modelSlider');
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        var modelSliderInput = modelSlider.find('.' + pid + 'Input');
        var ticks_labels = modelSliderInput.data('ticks_labels');
        ticks_labels = ticks_labels ? JSON.parse(ticks_labels) : ticks_labels;
        if (node.params[pid] == undefined) {
            var value = modelSliderInput.slider('getValue');
            node.params[pid] = ticks_labels ? ticks_labels[value] : value;
        } else {
            var value = parseFloat(node.params[pid]);
            value = ticks_labels ? ticks_labels.indexOf(value) : value;
            modelSliderInput.slider('setValue', value);
            if (ticks_labels == undefined) {
                modelSlider.find('.' + pid + 'Val').val(value);
            }
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })

    var colors = app.graph.colors();
    modelSlider.find('.slider-selection').css('background', colors[node.id % colors.length]);
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[node.id % colors.length]);
}

slider.update_connSlider = (link) => {
    if (link.conn_spec == undefined) return
    var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all');
    var modelSlider = $('#connections .link[data-id=' + link.id + ']');
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.conn_spec[pid] != undefined) {
            modelSlider.find('.' + pid + 'Input').slider('setValue', parseFloat(link.conn_spec[pid]));
            modelSlider.find('.' + pid + 'Val').val(link.conn_spec[pid]);
        } else {
            link.conn_spec[pid] = modelSlider.find('.' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    var colors = app.graph.colors();
    modelSlider.find('.slider-selection').css('background', colors[link.source % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])

}

slider.update_synSlider = (link) => {
    var synModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
    var modelSlider = $('#synapses .link[data-id=' + link.id + ']');
    var level = app.config.app().simulation.level;
    modelSlider.find('.paramSlider').each(function() {
        var pid = this.id;
        if (link.syn_spec[pid] != undefined) {
            modelSlider.find('.' + pid + 'Input').slider('setValue', parseFloat(link.syn_spec[pid]));
            modelSlider.find('.' + pid + 'Val').val(link.syn_spec[pid]);
        } else {
            link.syn_spec[pid] = modelSlider.find('.' + pid + 'Input').slider('getValue')
        }
        modelSlider.find('#' + pid).attr('level') > level ? modelSlider.find('#' + pid).hide() : modelSlider.find('#' + pid).show()
    })
    var colors = app.graph.colors();
    modelSlider.find('.slider-selection').css('background', colors[link.source % colors.length])
    modelSlider.find('.slider-handle').css('border', '2px solid ' + colors[link.source % colors.length])

}

slider.update_slider = () => {
    app.data.nodes.map((node) => {
        slider.update_nodeSlider(node)
    })
    app.data.links.map((link) => {
        slider.update_connSlider(link)
        slider.update_synSlider(link)
    })
}

slider.create_dataSlider = (ref, id, options) => {
    $(ref).append('<div id="' + id + '" class="dataSlider" level="' + options.level + '"></div>')
    var level = app.config.app().simulation.level;
    $('#' + id).attr('level') > level ? $('#' + id).hide() : $('#' + id).show()
    return _slider(ref, id, options);
}

var create_modelSlider = (ref, id, options) => {
    $(ref).append('<div id="' + id + '" class="paramSlider ' + ((id.indexOf('__') != -1) ? 'nested' : '') + '" level="' + options.level + '"></div>')
    return _slider(ref, id, options);
}

slider.init_modelSlider = (ref, model) => {
    $(ref).empty()
    $(ref).append('<div class="model ' + model.id + '"></div>')
    for (var idx in model.sliderDefaults) {
        var options = model.sliderDefaults[idx];
        create_modelSlider(ref + ' .' + model.id, options.id, options);
    }
}

module.exports = slider;
