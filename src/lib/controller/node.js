"use strict"

const connController = require('./connection');
const synController = require('./synapse');
const math = require('mathjs');
const numeric = require('numeric');

var nodeController = {}

nodeController.amplitude = function(dtime, dvalue) {
    var times = math.range(dtime, app.data.sim_time, dtime)._data;
    var amplitudes = math.range(dvalue, dvalue * (times.length + 10), dvalue)._data;
    return {
        times: times,
        values: amplitudes.slice(0, times.length)
    }
}

nodeController.update = function(node) {
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    nodeElem.find('.nodeSlider').empty()
    if (node.element_type == 'neuron' || node.element_type == 'stimulator') {
        var options = nodeDefaults.npop;
        options.value = node.n || 1
        app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
            .on('slideStop', function(d) {
                app.data.nodes[node.id].n = d.value
                if (node.element_type == 'neuron') {
                    app.chart.init()
                }
                app.simulation.simulate()
            })
        nodeElem.find('.nodeSlider #n input.paramVal').on('change', function() {
            app.selected_link = null;
            app.selected_node = node;
            var pkey = $(this).parents('.dataSlider').attr('id');
            var pvalue = $(this).val()
            var schema = $(this).data('schema')
            var valid = app.validation.validate(pkey, pvalue, schema)
            $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
            $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
            $(this).parents('.form-group').find('.help-block').html(valid.error)
            if (valid.error != null) return
            node[pkey] = valid.value
            app.slider.update_dataSlider()
            if (node.element_type == 'neuron') {
                app.chart.init()
            }
            app.simulation.simulate()
        })
    }
    if (node.element_type == 'stimulator') {
        var options = nodeDefaults.stim_time;
        options.max = app.data.sim_time
        options.value = [(node.params.start || 0), (node.params.stop || app.data.sim_time)]
        app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
            .on('slideStop', function(d) {
                node.params.start = d.value[0]
                delete node.params.stop
                if (d.value[1] < app.data.sim_time) {
                    node.params.stop = d.value[1]
                }
                app.simulation.simulate()
            })
        if (node.model == 'spike_generator') {
            var spike_dtime = node.spike_dtime || nodeDefaults.spike_dtime.value;
            var spike_weight = node.spike_weight || nodeDefaults.spike_weight.value
            node.params.spike_times = math.range(spike_dtime, app.data.sim_time, spike_dtime)._data
            node.params.spike_weights = numeric.rep([node.params.spike_times.length], spike_weight)
            var options = nodeDefaults.spike_dtime;
            options.value = node.spike_dtime;
            app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
                .on('slideStop', function(d) {
                    node.spike_dtime = d.value
                    node.params.spike_times = math.range(node.spike_dtime, app.data.sim_time, node.spike_dtime)._data
                    node.params.spike_weights = numeric.rep([node.params.spike_times.length], node.spike_weight || nodeDefaults.spike_weight.value)
                    app.simulation.simulate()
                })
            nodeElem.find('#spike_dtimeVal').on('change', function() {
                app.selected_link = null;
                app.selected_node = node;
                var pkey = $(this).parents('.paramSlider').attr('id');
                var pvalue = $(this).val()
                var schema = $(this).data('schema')
                var valid = app.validation.validate(pkey, pvalue, schema)
                $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
                $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
                $(this).parents('.form-group').find('.help-block').html(valid.error)
                if (valid.error != null) return
                node.spike_dtime = valid.value;
                node.params.spike_times = math.range(node.spike_dtime, app.data.sim_time, node.spike_dtime)._data
                node.params.spike_weights = numeric.rep([node.params.spike_times.length], node.spike_weight || nodeDefaults.spike_weight.value)
                app.slider.update_nodeSlider(node)
                app.simulation.simulate()
            })
        }
        if (node.model == 'step_current_generator') {
            var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
            var amplitude_dvalue = (node.amplitude_dvalue || nodeDefaults.amplitude_dvalue.value);
            var amplitude = nodeController.amplitude(amplitude_dtime, amplitude_dvalue);
            node.params.amplitude_times = amplitude.times;
            node.params.amplitude_values = amplitude.values;
            var options = nodeDefaults.amplitude_dtime;
            options.value = amplitude_dtime;
            var amplitude = nodeController.amplitude(amplitude_dtime, amplitude_dvalue)
            node.params.amplitude_times = amplitude.times;
            node.params.amplitude_values = amplitude.values;
            app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
                .on('slideStop', function(d) {
                    node.amplitude_dtime = d.value;
                    var amplitude_dvalue = (node.amplitude_dvalue || nodeDefaults.amplitude_dvalue.value);
                    var amplitude = nodeController.amplitude(node.amplitude_dtime, amplitude_dvalue);
                    node.params.amplitude_times = amplitude.times;
                    node.params.amplitude_values = amplitude.values;
                    app.simulation.simulate()
                })
            nodeElem.find('#amplitude_dtimeVal').on('change', function() {
                app.selected_link = null;
                app.selected_node = node;
                var pkey = $(this).parents('.paramSlider').attr('id');
                var pvalue = $(this).val()
                var schema = $(this).data('schema')
                var valid = app.validation.validate(pkey, pvalue, schema)
                $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
                $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
                $(this).parents('.form-group').find('.help-block').html(valid.error)
                if (valid.error != null) return
                node.amplitude_dtime = valid.value;
                var amplitude_dvalue = (node.amplitude_dvalue || nodeDefaults.amplitude_dvalue.value);
                var amplitude = nodeController.amplitude(node.amplitude_dtime, amplitude_dvalue);
                node.params.amplitude_times = amplitude.times;
                node.params.amplitude_values = amplitude.values;
                app.slider.update_nodeSlider(node)
                app.simulation.simulate()
            })
            var options = nodeDefaults.amplitude_dvalue;
            options.value = amplitude_dvalue;
            app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
                .on('slideStop', function(d) {
                    node.amplitude_dvalue = d.value;
                    var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
                    var amplitude = nodeController.amplitude(amplitude_dtime, node.amplitude_dvalue)
                    node.params.amplitude_times = amplitude.times;
                    node.params.amplitude_values = amplitude.values;
                    app.simulation.simulate()
                })
            nodeElem.find('#amplitude_dvalueVal').on('change', function() {
                    app.selected_link = null;
                    app.selected_node = node;
                    var pkey = $(this).parents('.paramSlider').attr('id');
                    var pvalue = $(this).val()
                    var schema = $(this).data('schema')
                    var valid = app.validation.validate(pkey, pvalue, schema)
                    $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
                    $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
                    $(this).parents('.form-group').find('.help-block').html(valid.error)
                    if (valid.error != null) return
                    node.amplitude_dvalue = valid.value;
                    var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
                    var amplitude = nodeController.amplitude(amplitude_dtime, node.amplitude_dvalue)
                    node.params.amplitude_times = amplitude.times;
                    node.params.amplitude_values = amplitude.values;
                    app.slider.update_nodeSlider(node)
                    app.simulation.simulate()
                })
                // var options = nodeDefaults.amplitude_value_max;
                // options.value = amplitude_value_max;
                // app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
                //     .on('slideStop', function(d) {
                //         node.amplitude_value_max = d.value;
                //         var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
                //         node.params.amplitude_times = math.range(amplitude_dtime, app.data.sim_time, amplitude_dtime)._data
                //         node.params.amplitude_values = numeric.linspace(node.amplitude_value_max / node.params.amplitude_times.length, node.amplitude_value_max, node.params.amplitude_times.length)
                //         app.simulation.simulate()
                //     })
                // nodeElem.find('#amplitude_value_maxVal').on('change', function() {
                //     app.selected_link = null;
                //     app.selected_node = node;
                //     var pkey = $(this).parents('.paramSlider').attr('id');
                //     var pvalue = $(this).val()
                //     var schema = $(this).data('schema')
                //     var valid = app.validation.validate(pkey, pvalue, schema)
                //     $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
                //     $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
                //     $(this).parents('.form-group').find('.help-block').html(valid.error)
                //     if (valid.error != null) return
                //     node.amplitude_value_max = valid.value;
                //     var amplitude_dtime = node.amplitude_dtime || nodeDefaults.amplitude_dtime.value;
                //     node.params.amplitude_times = math.range(amplitude_dtime, app.data.sim_time, amplitude_dtime)._data
                //     node.params.amplitude_values = numeric.linspace(node.amplitude_value_max / node.params.amplitude_times.length, node.amplitude_value_max, node.params.amplitude_times.length)
                //     app.slider.update_nodeSlider(node)
                //     app.simulation.simulate()
                // })
        }

    }
    if (node.element_type == 'recorder') {
        var options = nodeDefaults.rec_time;
        options.max = app.data.sim_time
        options.value = [(node.params.start || 0), (node.params.stop || app.data.sim_time)]
        app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
            .on('slideStop', function(d) {
                node.params.start = d.value[0]
                delete node.params.stop
                if (d.value[1] < app.data.sim_time) {
                    node.params.stop = d.value[1]
                }
                app.simulation.simulate()
            })
        if (node.model == 'spike_detector') {
            var options = nodeDefaults.nbins
            options.value = nodeDefaults.nbins.ticks_labels.indexOf(node.nbins) || 1
            app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
                .on('slideStop', function(d) {
                    app.data.nodes[node.id].nbins = options.ticks_labels[d.value]
                    var recorder = app.simulation.recorders.find(function(recorder) {
                            return recorder.node.id == node.id;
                        })
                        // if (recorder.chart.barChart) {
                    recorder.chart.update(recorder)
                        // }
                })
        }
    }
    var colors = app.chart.colors();
    nodeElem.find('.slider-selection').css('background', app.controller.colors[node.id % colors.length])
    nodeElem.find('.slider-handle').css('border', '2px solid ' + app.controller.colors[node.id % colors.length])

    nodeElem.find('.modelSlider').empty()
    var modelDefaults = app.config.nest(node.element_type);
    app.slider.init_modelSlider('#nodes .node[data-id=' + node.id + '] .modelSlider', modelDefaults.filter(function(d) {
        return d.id == node.model;
    })[0])
    nodeElem.find('.modelSlider .sliderInput').on('slideStop', function() {
        app.selected_node = app.data.nodes[$(this).parents('.node').data('id')];
        var pkey = $(this).parents('.paramSlider').attr('id');
        app.selected_node.params[pkey] = parseFloat(this.value)
        app.simulation.simulate()
    })
    if (modelDefaults.params) {
        modelDefaults.params.map(function(param) {
            nodeElem.find('.modelSlider').append('<div id="' + param.id + '" class="form-group"></div>')
            nodeElem.find('#' + param.id).append('<label for="' + param.id + 'Input"/>' + param.label + '</label>')
            nodeElem.find('#' + param.id).append('<input type="text" class="form-control" name="' + param.id + '" id="' + param.id + 'Input"/>')
        })
    }
    nodeElem.find('.modelSlider input.paramVal').on('change', function() {
        app.selected_link = null;
        app.selected_node = node;
        var pkey = $(this).parents('.paramSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        app.selected_node.params[pkey] = valid.value
        app.slider.update_nodeSlider(node)
        app.simulation.simulate()
    })
    nodeElem.find('.selection').empty()
    if (node.element_type == 'recorder') {
        if (node.model == 'multimeter') {
            nodeElem.find('.selection').append('<div class="recSelect form-group hideOnDrawing"></div>')
            nodeElem.find('.recSelect').append('<label for="record_' + node.id + '">Record from</label>')
            nodeElem.find('.recSelect').append('<select data-id="' + node.id + '" id="record_' + node.id + '" class="record form-control"></select>')
            app.model.get_recordables_list(node)
        }
        $('#record_' + node.id).on('change', function() {
            var recorder = app.simulation.recorders.filter(function(recorder) {
                return recorder.node.id == node.id
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

        if (['voltmeter', 'multimeter'].indexOf(node.model) != -1) {
            nodeElem.find('.selection').append('<div class="seriesSelect form-group hideOnDrawing"></div>')
            nodeElem.find('.seriesSelect').append('<label for="series_' + node.id + '">Data series</label>')
            nodeElem.find('.seriesSelect').append('<select data-id="' + node.id + '" id="series_' + node.id + '" class="series form-control"></select>')
            nodeElem.find('#series_' + node.id).append('<option value="overlap">Overlap</option>')
            nodeElem.find('#series_' + node.id).append('<option value="stack">Stack</option>')
            nodeElem.find('#series_' + node.id).val((node.series || 'stack'))
            $('#series_' + node.id).on('change', function() {
                var recorder = app.simulation.recorders.find(function(recorder) {
                    return recorder.node.id == node.id;
                })
                recorder.node.series = this.value;
                recorder.chart.update(recorder)
            })
        }

        if (node.model == 'spike_detector') {
            node.record_from = node.record_from || ['count'];
            node.PSTHchart = node.PSTHchart || 'bar';
            nodeElem.find('.selection').append('<div class="psthSelect form-group hideOnDrawing"></div>')
            nodeElem.find('.psthSelect').append('<label for="psth_' + node.id + '">Chart for PSTH</label>')
            nodeElem.find('.psthSelect').append('<select data-id="' + node.id + '" id="psthChart_' + node.id + '" class="psth form-control"></select>')
            nodeElem.find('#psthChart_' + node.id).append('<option value="bar" class="form-control">Bar chart</option>')
            nodeElem.find('#psthChart_' + node.id).append('<option value="line" class="form-control">Line chart</option>')
            $('#psthChart_' + node.id).on('change', function() {
                var recorder = app.simulation.recorders.find(function(recorder) {
                    return recorder.node.id == node.id;
                })
                recorder.node.psth = this.value;
                recorder.chart.update(recorder)
            })
            nodeElem.find('#psthChart_' + node.id).val(node.PSTHchart)

            nodeElem.find('.psthSelect').append('<label for="psthOrdinate_' + node.id + '">Ordinate of PSTH</label>')
            nodeElem.find('.psthSelect').append('<select data-id="' + node.id + '" id="psthOrdinate_' + node.id + '" class="record form-control"></select>')
            nodeElem.find('#psthOrdinate_' + node.id).append('<option value="count" class="count form-control">Spike counts</option>')
            nodeElem.find('#psthOrdinate_' + node.id).append('<option value="rate" class="rate form-control">Firing rate [spikes/sec]</option>')
            $('#psthOrdinate_' + node.id).on('change', function() {
                var recorder = app.simulation.recorders.find(function(recorder) {
                    return recorder.node.id == node.id;
                })
                recorder.node.record_from = [this.value];
                recorder.chart.update(recorder)
            })
            nodeElem.find('#psthOrdinate_' + node.id).val(node.record_from[0])
        }
    }
    app.slider.update_nodeSlider(node);
}

nodeController.init = function(node) {
    $('#nodes .controller').append(app.renderer.node(node))
    var nodeElem = $('#nodes .node[data-id=' + node.id + ']');
    var modelDefaults = app.config.nest(node.element_type);
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        nodeElem.find('.modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
    }
    nodeElem.find('option#' + node.model).prop('selected', true);
    nodeElem.find('.modelSelect').toggleClass('disabled', node.disabled || false)
    nodeElem.find('.glyphicon-remove').toggle(node.disabled || false)
    nodeElem.find('.glyphicon-ok').toggle(!node.disabled && true)
    nodeElem.find('.modelSelect').on('change', function(d, i) {
        app.simulation.run(false)
        app.selected_link = null
        app.selected_node = node
        node.model = this.value;
        node.params = {};

        app.controller.simulation.init()
        app.model.node_selected(node)
        nodeController.update(node)

        if (app.chart.networkLayout.drawing) {
            app.chart.networkLayout.update()
            return
        }

        app.data.links.filter(function(link) {
            return link.target == node.id
        }).map(function(link) {
            connController.update(link)
            synController.update(link)
        })

        if (app.selected_node.element_type == 'recorder') {
            app.simulation.update()
        } else {
            app.simulation.simulate()
        }
    })

    nodeElem.find('.disableNode').on('click', function() {
        app.simulation.run(false)
        node.disabled = !node.disabled;
        var disabled = node.disabled || false
        app.simulation.update()
    })
    if (node.disabled) return

    $('#nodeScrollspy .nav').append(app.renderer.scrollspy(node))
    $('#nodeScrollspy').find('.node[data-id=' + node.id + ']').on('click', function(e) {
        e.preventDefault()
        $($(this).find('a').attr('href'))[0].scrollIntoView();
        scrollBy(0, -50);
        $('.node').removeClass('active');
        $(this).addClass('active');
        app.selected_node = node
        app.selected_link = null;
        app.chart.networkLayout.update()
        app.chart.update()
    })
    if (!node.model) return
    nodeController.update(node)
}

module.exports = nodeController;
