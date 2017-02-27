"use strict"

var events = {};


events.nodeSlider = function() {
    $('#nodes .modelSlider .sliderInput').on('slideStop', function() {
        app.selected_node = app.data.nodes[$(this).parents('.node').attr('nidx')];
        app.selected_node.params[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
        app.simulation.simulate()
    })
}

events.connSlider = function() {
    $('#connections .connSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').attr('lidx')];
        app.selected_link.conn_spec[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
        app.networkLayout.restart()
        app.simulation.simulate()
    })
}

events.synSlider = function() {
    $('#synapses .synSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').attr('lidx')];
        app.selected_link.syn_spec[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
        app.networkLayout.restart()
        app.simulation.simulate()
    })
}

events.dataSlider = function() {
    $('.dataSlider .sliderInput').on('slideStop', function() {
        if ($(this).parents('.node').hasClass('output')) {
            app.simulation.update()
        } else {
            app.simulation.simulate()
        }
    })
}

events.model_select = function() {
    $('#nodes .modelSelect').on('change', function(d,i) {
        app.simulation.run(false)
        app.selected_node = app.data.nodes[$(this).parents('.node').attr('nidx')];
        app.selected_node.model = this.value;
        app.selected_node.params = {};
        app.model.node_selected(app.selected_node)
        var modelDefaults = app.config.modelSlider(app.selected_node.type)[($(this).prop('selectedIndex')-1)]
        app.slider.init_modelSlider('#node_' + app.selected_node.id + ' .modelSlider', modelDefaults)
        app.slider.update_nodeSlider(app.selected_node)
        events.nodeSlider()
        if (app.selected_node.type == 'output') {
            app.simulation.init()
        } else {
            app.simulation.simulate()
        }
    })
    $('#connections .modelSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_link = app.data.links[$(this).parents('.link').attr('lidx')];
        app.selected_link.conn_spec = {
            rule: this.value
        };
        app.model.conn_selected(app.selected_link)
        var modelDefaults = app.config.modelSlider('connection')[($(this).prop('selectedIndex')-1)]
        console.log(modelDefaults)
        app.slider.init_modelSlider('#conn_' + app.selected_link.id + ' .connSlider', modelDefaults)
        app.slider.update_connSlider(app.selected_link)
        events.connSlider()
        app.simulation.simulate()
    })
    $('#synapses .modelSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_link = app.data.links[$(this).parents('.link').attr('lidx')];
        app.selected_link.syn_spec = {
            model: this.value
        };
        app.model.syn_selected(app.selected_link)
        var modelDefaults = app.config.modelSlider('synapse')[($(this).prop('selectedIndex')-1)]
        app.slider.init_modelSlider('#syn_' + app.selected_link.id + ' .synSlider', modelDefaults)
        app.slider.update_synSlider(app.selected_link)
        events.synSlider()
        app.simulation.simulate()
    })
}

events.controllerHandler = function() {
    // if (app.layout) {
    //     $('.model').on('mouseover', function() {
    //         app.selected_node = app.data.nodes[$(this).attr('nidx')];
    //         app.selected_link = null;
    //         app.layout.restart()
    //     }).on('mouseout', function() {
    //         app.selected_node = null;
    //         app.layout.restart()
    //     })
    // }
    events.model_select()
    events.nodeSlider()
    events.connSlider()
    events.synSlider()
    events.dataSlider()

    $('#autoscale').on('click', app.simulation.update)

    $('#id_record').on('change', function() {
        console.log('aa')
        var recNode = app.data.nodes.filter(function(node) {
            return node.type == 'output'
        })[0]

        var source = d3.merge(app.data.links.filter(function(link) {
            return link.target == recNode.id
        }).map(function(link) {
            return app.data.nodes[link.source].ids
        }))

        recNode.record_from = this.value;
        app.simulation.data.y = source.map(function() {
            return []
        });
        recNode.events.senders.map(function(d, i) {
            app.simulation.data.y[d - source[0]].push(recNode.events[recNode.record_from][i])
        });
        if (document.getElementById('autoscale').checked) {
            app.simChart.trace.linechart.yScale.domain(d3.extent([].concat.apply([], app.simulation.data.y)))
        }
        app.simChart.trace.linechart.data(app.simulation.data)
            .yLabel(app.model.record_labels[recNode.record_from] || 'a.u.')
            .update();
    })

    // $('#myScrollspy').find('a').on('click', function(e) {
    //     e.preventDefault();
    //     $($(this).attr('href'))[0].scrollIntoView();
    //     scrollBy(0, -50);
    // });
}

events.buttonHandler = function() {
    $('#index').on('click', function() {
        app.simulation.stop()
        setTimeout(function() {
            window.location = "../index.html"
        }, 100)
    })
    $('#close').on('click', function() {
        app.simulation.stop()
        setTimeout(window.close, 100)
    })
    $('#simulation-resume').on('click', app.simulation.resumeToggle)
    $('.level').on('click', function() {
        $('.level').find('.glyphicon-ok').hide()
        app.config.app().set('level', parseInt($(this).attr('level')))
        for (var nid in app.data.nodes) {
            var node = app.data.nodes[nid];
            if (node.model) {
                app.slider.update_nodeSlider(node)
            }
        }
        for (var lid in app.data.links) {
            var link = app.data.links[lid];
            if (link.conn_spec || 1) {
                app.slider.update_connSlider(link)
            }
            if (link.syn_spec || 1) {
                app.slider.update_synSlider(link)
            }
        }
        app.slider.update_dataSlider_level()
        $(this).find('.glyphicon-ok').show()
    })
    $('#simulation-add-submit').on('click', function(e) {
        app.data.name = $('#simulation-add-form #simulation-name').val()
        var date = new Date;
        app.data.user = app.config.app().get('user.name') || process.env.USER;
        app.data.createdAt = date;
        app.data.updatedAt = date;
        app.data.group = 'user';
        $('#title').html(app.data.name)
        $('#subtitle').empty()
        var date = app.format.date(app.data.createdAt)
        $('#subtitle').append(date ? '<span style="margin-left:20px">' + date + '</span>' : '')
        $('#subtitle').append(app.data.user ? '<span style="margin-left:20px">' + app.data.user + '</span>' : '')

        app.db.add(app.data)
    })
}

module.exports = events
