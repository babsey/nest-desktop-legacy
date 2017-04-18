"use strict"

// Events for the controller

const joi = require('joi');

var events = {};

events.nodeSlider = function() {
    $('#nodes .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_node = app.data.nodes[$(this).parents('.node').data('id')];
        var pkey = $(this).parents('.paramSlider').attr('id');
        app.selected_node.params[pkey] = parseFloat(this.value)
        app.simulation.simulate()
    })
}

events.nodeValInput = function(node) {
    $('#node_'+node.id).find('.modelSlider input.paramVal').on('change', function() {
        app.selected_node = node;
        var pkey = $(this).parents('.paramSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        app.selected_node.params[pkey] = pvalue
        app.slider.update_nodeSlider(app.selected_node)
        app.simulation.simulate()
    })

    $('#node_'+node.id).find('.dataSlider input.paramVal').on('change', function() {
        app.selected_node = node;
        var pkey = $(this).parents('.dataSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        app.selected_node[pkey] = valid.value
        app.slider.update_dataSlider()
        app.simulation.simulate()
    })
}

events.connSlider = function() {
    $('#connections .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        var param = $(this).parents('.paramSlider').attr('id');
        app.selected_link.conn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
        app.simulation.simulate()
    })
}

events.synSlider = function() {
    $('#synapses .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        var param = $(this).parents('.paramSlider').attr('id');
        app.selected_link.syn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
        app.simulation.simulate()
    })
}

events.dataSlider = function() {
    $('.dataSlider .sliderInput').on('slideStop', function() {
        if (!$(this).parents('.node').hasClass('recorder')) {
            app.simulation.simulate()
            return
        }
        var recId = $(this).parents('.node').data('id')
        var recorder = app.simulation.recorders.find(function(recorder) {
            return recorder.node.id == recId
        })
        if (recorder.chart.barChart) {
            recorder.chart.update(recorder)
        }
    })
}

events.model_select = function() {
    $('#nodes .modelSelect').on('change', function(d, i) {
        app.simulation.run(false)
        app.selected_node = app.data.nodes[$(this).parents('.node').data('id')];
        app.selected_node.model = this.value;
        app.selected_node.params = {};
        app.model.node_selected(app.selected_node)
        if (app.chart.networkLayout.drawing) {
            app.chart.networkLayout.update()
            return
        }
        var modelDefaults = app.config.nest(app.selected_node.element_type)[($(this).prop('selectedIndex') - 1)]
        app.slider.init_modelSlider('#nodes .node[data-id="' + app.selected_node.id + '"] .modelSlider', modelDefaults)
        // app.slider.init_modelSlider('#node_' + app.selected_node.id + ' .modelSlider', modelDefaults)
        app.slider.update_nodeSlider(app.selected_node)
        events.nodeSlider()
        if (modelDefaults.params) {
            modelDefaults.params.map(function(param) {
                $('#nodes .node[data-id=' + app.selected_node.id + '] .content').append('<div id=' + param.id + ' class="param ' + param.id + ' form-group"></div>')
                var p = $('#nodes .node[data-id=' + app.selected_node.id + '] .' + param.id)
                p.append('<label for="' + param.id + 'Input ' + app.selected_node.id + '">' + param.label + '</label>')
                p.append('<div><input data-schema="array" type="text" class="form-control" name="' + param.id + '" id="' + param.id + 'Input ' + app.selected_node.id + '"/></div>')
                p.append('<div class="help-block"></div>')
            })
        }
        events.nodeValInput(app.selected_node)
        app.data.links.filter(function(link) {
            return link.target == app.selected_node.id
        }).map(function(link) {
            delete link.syn_spec.receptor_type
            var divSynLink = $('#synapses').find('.link[data-id=' + link.id + '] .content')
            divSynLink.find('.recSelect').hide().empty()
            if (app.selected_node.model != 'iaf_cond_alpha_mc') return
            var receptorModels = app.config.nest('receptor')[app.selected_node.model]
            link.syn_spec.receptor_type = 1
            for (var ridx in receptorModels) {
                var model = receptorModels[ridx];
                divSynLink.find('.recSelect').append('<option id="' + ridx + '" value="' + model.id + '"' + (model.id == 1 ? 'selected' : '') + '>' + model.label + '</option>')
            }
            divSynLink.find('.recSelect').show()
        })
        if (app.selected_node.element_type == 'recorder') {
            app.simulation.update()
        } else {
            // app.changes.nodes[nidx]['model'] = this.value;
            app.simulation.simulate()
        }
    })
    $('#nodes .disableNode').on('click', function() {
        app.simulation.run(false)
        var node = app.data.nodes[$(this).parents('.node').data('id')];
        node.disabled = !node.disabled;
        var disabled = node.disabled || false
        app.simulation.update()
    })
    $('#connections .modelSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        app.selected_link.conn_spec = {
            rule: this.value
        };
        app.model.conn_selected(app.selected_link)
        var modelDefaults = app.config.nest('connection')[($(this).prop('selectedIndex') - 1)]
        app.slider.init_modelSlider('#connections .link[data-id="' + app.selected_link.id + '"] .modelSlider', modelDefaults)
        app.slider.update_connSlider(app.selected_link)
        events.connSlider()
        // app.changes.links[lidx]['connRule'] = this.value;
        app.simulation.simulate()
    })
    $('#connections .disableLink').on('click', function() {
        app.simulation.run(false)
        var link = app.data.links[$(this).parents('.link').data('id')]
        link.disabled = !link.disabled;
        var disabled = link.disabled || false
        app.simulation.update()
    })
    $('#synapses .synSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        app.selected_link.syn_spec = {
            model: this.value
        };
        app.model.syn_selected(app.selected_link)
        var modelDefaults = app.config.nest('synapse')[($(this).prop('selectedIndex') - 1)]
        app.slider.init_modelSlider('#synapses .link[data-id="' + app.selected_link.id + '"] .modelSlider', modelDefaults)
        app.slider.update_synSlider(app.selected_link)
        events.synSlider()
        // app.changes.links[lidx]['synModel'] = this.value;
        app.simulation.simulate()
    })

    $('#synapses .recSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        app.selected_link.syn_spec.receptor_type = parseInt(this.value)
        app.simulation.simulate()
    })

}

events.controller = function() {
    $('#nodeScrollspy').find('.node').on('click', function() {
        var nidx = $(this).data('id');
        if (app.selected_node) {
            app.selected_node = (app.selected_node.id == nidx ? null : app.data.nodes[nidx])
        } else {
            app.selected_node = app.data.nodes[nidx]
        }
        app.selected_link = null;
        app.chart.networkLayout.update()
        app.chart.update()
    })
    events.model_select()
    events.nodeSlider()
    app.data.nodes.map(function(node) {
        events.nodeValInput(node)
    })
    events.connSlider()
    events.synSlider()
    events.dataSlider()

    $('.record').on('change', function() {
        var id = $(this).parents('.node').data('id');
        var recorder = app.simulation.recorders.filter(function(recorder) {
            return recorder.node.id == id
        })[0];
        var rec = this.value;
        recorder.node.record_from = recorder.node.params.record_from.filter(function(record_from) {
            return record_from.indexOf(rec) != -1
        })
        recorder.data.senders = []
        recorder.data.recs = []
        var y = recorder.node.record_from.map(function(record_from, ridx) {
            return recorder.senders.map(function(s, i) {
                recorder.data.recs.push(ridx)
                recorder.data.senders.push(i)
                return recorder.events[record_from].filter(function(r, i) {
                    return recorder.events.senders[i] == s
                })
            })
        })
        recorder.data.y = [].concat.apply([], y);

        if ($('#autoscale').prop('checked')) {
            recorder.chart.lineChart.yScale.domain(d3.extent([].concat.apply([], recorder.data.y)))
        }
        app.chart.update();
    })

    // $('#myScrollspy').find('a').on('click', function(e) {
    //     e.preventDefault();
    //     $($(this).attr('href'))[0].scrollIntoView();
    //     scrollBy(0, -50);
    // });
}



module.exports = events
