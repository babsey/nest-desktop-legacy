"use strict"

// Events for the controller

var events = {};

events.nodeSlider = function() {
    $('#nodes .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_node = app.data.nodes[$(this).parents('.node').data('id')];
        var param = $(this).parents('.paramSlider').attr('id');
        app.selected_node.params[param] = parseFloat(this.value)
            // app.changes.nodes[$(this).parents('.node').data('id')][param] = parseFloat(this.value)
        app.simulation.simulate()
    })
}

events.connSlider = function() {
    $('#connections .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        var param = $(this).parents('.paramSlider').attr('id');
        app.selected_link.conn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
            // app.changes.links[$(this).parents('.link').data('id')][param] = parseFloat(this.value)
        app.simulation.simulate()
    })
}

events.synSlider = function() {
    $('#synapses .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        var param = $(this).parents('.paramSlider').attr('id');
        app.selected_link.syn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
            // app.changes.links[$(this).parents('.link').data('id')][param] = parseFloat(this.value)
        app.simulation.simulate()
    })
}

events.dataSlider = function() {
    $('.dataSlider .sliderInput').on('slideStop', function() {
        if (!$(this).parents('.node').hasClass('output')) {
            app.simulation.simulate()
            return
        }
        var recId = $(this).parents('.node').data('id')
        var output = app.simulation.outputs.find(function(output) {
            return output.node.id == recId
        })
        if (output.chart.barChart) {
            output.chart.update(output)
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
        var modelDefaults = app.config.modelSlider(app.selected_node.type)[($(this).prop('selectedIndex') - 1)]
        app.slider.init_modelSlider('#nodes .node[data-id="' + app.selected_node.id + '"] .modelSlider', modelDefaults)
            // app.slider.init_modelSlider('#node_' + app.selected_node.id + ' .modelSlider', modelDefaults)
        app.slider.update_nodeSlider(app.selected_node)
        events.nodeSlider()
        if (app.selected_node.type == 'output') {
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
        var modelDefaults = app.config.modelSlider('connection')[($(this).prop('selectedIndex') - 1)]
        console.log(modelDefaults)
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
    $('#synapses .modelSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_link = app.data.links[$(this).parents('.link').data('id')];
        app.selected_link.syn_spec = {
            model: this.value
        };
        app.model.syn_selected(app.selected_link)
        var modelDefaults = app.config.modelSlider('synapse')[($(this).prop('selectedIndex') - 1)]
        app.slider.init_modelSlider('#synapses .link[data-id="' + app.selected_link.id + '"] .modelSlider', modelDefaults)
        app.slider.update_synSlider(app.selected_link)
        events.synSlider()
            // app.changes.links[lidx]['synModel'] = this.value;
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
    events.connSlider()
    events.synSlider()
    events.dataSlider()

    $('.record').on('change', function() {
        var id = $(this).parents('.node').data('id');
        var output = app.simulation.outputs.filter(function(output) {
            return output.node.id == id
        })[0];
        output.node.record_from = this.value
        output.data.y = output.senders.map(function() {
            return []
        });
        output.events.senders.map(function(d, i) {
            var idx = output.senders.indexOf(d);
            output.data.y[idx].push(output.events[output.node.record_from][i])
        });
        if ($('#autoscale').prop('checked')) {
            output.chart.lineChart.yScale.domain(d3.extent([].concat.apply([], output.data.y)))
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
