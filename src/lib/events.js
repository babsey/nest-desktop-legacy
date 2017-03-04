"use strict"

var events = {};


events.navigation = function() {
    $('#index').on('click', function() {
        app.simulation.stop()
        setTimeout(function() {
            window.location = "../index.html"
        }, 100)
    })
    $('#simulation-resume').on('click', app.simulation.resumeToggle)
    $('#layout-button').on('click', function() {
        $('#layout').fadeToggle('fast')
        setTimeout(function() {
            var layoutStyle = $('#layout').attr('style');
            var layout = layoutStyle ? (layoutStyle.indexOf('display: none') == -1) : true
            app.config.app().set('simulation.chart.layout', layout)
            $('#layout-button').toggleClass('active', layout)
        }, 250)
    })
    $('.level').on('click', function() {
        $('.level').find('.glyphicon-ok').hide()
        app.config.app().set('simulation.level', parseInt($(this).attr('level')))
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
        app.data.description = $('#simulation-add-form #simulation-description').val()
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
    $('.simulation').on('click', function(d) {
        app.simulation.stop()
        location.href = location.origin + location.pathname + '?simulation=' + this.id
    })
    $('a[rel=popover]').popover({
        html: true,
        trigger: 'hover',
        placement: 'left',
        content: function() {
            return '<div>Created at ' + $(this).data('date') + '</div>' + '<img style="width:250px" src="' + $(this).data('img') + '" />';
        }
    });
    $('#close').on('click', function() {
        app.simulation.stop()
        setTimeout(window.close, 100)
    })
}

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
        app.simChart.networkLayout.update()
        app.simulation.simulate()
    })
}

events.synSlider = function() {
    $('#synapses .synSlider .sliderInput').on('slideStop', function() {
        app.selected_link = app.data.links[$(this).parents('.link').attr('lidx')];
        app.selected_link.syn_spec[$(this).parents('.paramSlider').attr('id')] = parseFloat(this.value)
        app.simChart.networkLayout.update()
        app.simulation.simulate()
    })
}

events.dataSlider = function() {
    $('.dataSlider .sliderInput').on('slideStop', function() {
        if ($(this).parents('.node').hasClass('output') && app.simChart.rasterPlot.barchart) {
            app.simChart.rasterPlot.update(app.data.nodes[$(this).parents('.node').attr('nidx')])
        } else {
            app.simulation.simulate()
        }
    })
}

events.model_select = function() {
    $('#nodes .modelSelect').on('change', function(d, i) {
        app.simulation.run(false)
        app.selected_node = app.data.nodes[$(this).parents('.node').attr('nidx')];
        app.selected_node.model = this.value;
        app.selected_node.params = {};
        app.model.node_selected(app.selected_node)
        var modelDefaults = app.config.modelSlider(app.selected_node.type)[($(this).prop('selectedIndex') - 1)]
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
        var modelDefaults = app.config.modelSlider('connection')[($(this).prop('selectedIndex') - 1)]
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
        var modelDefaults = app.config.modelSlider('synapse')[($(this).prop('selectedIndex') - 1)]
        app.slider.init_modelSlider('#syn_' + app.simChart.selected_link.id + ' .synSlider', modelDefaults)
        app.slider.update_synSlider(app.selected_link)
        events.synSlider()
        app.simulation.simulate()
    })
}

events.controller = function() {
    $('#nodeScrollspy').find('.node').on('click', function() {
        var nidx = $(this).attr('nidx');
        if (app.selected_node) {
            app.selected_node = (app.selected_node.id == nidx ? null : app.data.nodes[nidx])
        } else {
            app.selected_node = app.data.nodes[nidx]
        }
        app.selected_link = null;
        app.simChart.networkLayout.update()
        if (app.simChart.rasterPlot.barchart) {
            app.simChart.rasterPlot.barchart.update()
        }
    })
    events.model_select()
    events.nodeSlider()
    events.connSlider()
    events.synSlider()
    events.dataSlider()

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
        if ($('#autoscale').prop('checked')) {
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

events.chart = function() {
    $('#autoscale').on('click', app.simChart.update)
    $('#color').on('click', function() {
        app.config.app().set('simulation.chart.color', $('#color').prop('checked'))
        app.simChart.update()
    })

    window.addEventListener('resize', function() {
        app.resizing = true
        app.simChart.init()
        app.simChart.update()
        app.simChart.networkLayout.update()
        app.resizing = false
    });
}

module.exports = events
