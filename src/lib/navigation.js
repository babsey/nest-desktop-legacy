"use strict"

var navigation = {};


navigation.events = function() {
    $('#index').on('click', function() {
        app.simulation.stop()
        setTimeout(function() {
            window.location = "../index.html"
        }, 100)
    })
    $('#edit-network').on('click', function() {
        var drawing = !app.chart.networkLayout.drawing;
        app.chart.networkLayout.drawing = drawing;
        $('.nav-tabs a[href="#nodes"]').tab('show');
        $('.hideOnDrawing').toggle(!drawing)
        $('.disableOnDrawing').toggleClass('disabled', drawing)
        var networkLayout = app.config.app().get('chart.networkLayout')
        app.chart.networkLayout.toggle(drawing || networkLayout)
        app.chart.networkLayout.update()
        if (drawing) return
        $('#autoscale').prop('checked', 'checked')
        app.simulation.update()
    })
    $('#simulation-resume').on('click', app.simulation.resumeToggle)
    $('#view-protocol').on('click', function() {
        var protocol = app.config.app().get('simulation.protocol') || false
        app.config.app().set('simulation.protocol', !protocol)
        $('#view-protocol').find('.glyphicon-ok').toggle(!protocol)
        app.protocol.update()
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
    $('#chart-color').on('click', function() {
        var color = app.config.app().get('chart.color') || false
        app.config.app().set('chart.color', !color)
        $('#chart-color').find('.glyphicon-ok').toggle(!color)
        app.chart.update()
    })
    $('#view-networkLayout').on('click', function() {
        var networkLayout = !app.config.app().get('chart.networkLayout') || false
        app.config.app().set('chart.networkLayout', networkLayout)
        app.chart.networkLayout.toggle(networkLayout)
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
        // app.simulation.id = this.id
        // app.simulation.init()
        location.href = location.origin + location.pathname + '?simulation=' + this.id
    })
    $('#close').on('click', function() {
        app.simulation.stop()
        setTimeout(window.close, 100)
    })
}

navigation.init = function() {
    $("#config").find('#level_' + app.config.app().get('simulation.level')).find('.glyphicon-ok').show()
    $("#config").find('#view-protocol').find('.glyphicon-ok').toggle(app.config.app().get('simulation.protocol') || false)
    $("#config").find('#chart-color').find('.glyphicon-ok').toggle(app.config.app().get('chart.color') || false)

    // Load protocol list
    app.protocol.init()

    // Load simulation list
    $('#get-simulation-list').attr('disabled', 'disabled')
    $('#simulation-list').empty()
    var groups = app.config.app().get('simulation.groups');
    groups.map(function(grp, idx) {
        app.simulation.list({
            group: grp.id
        }).exec(function(err, docs) {
            docs = docs.filter(function(doc) {
                return doc._id != app.simulation.id
            })
            if (docs.length == 0) return
            if (idx != 0) {
                $('#simulation-list').append('<li role="separator" class="divider"></li>')
            }
            docs.map(function(doc) {
                $('#simulation-list').append(app.renderer.simulationDropdown(doc))
            });
        })
    })
    $('#get-simulation-list').attr('disabled', false)

    setTimeout(function() {
        $('#simulation-list a[rel=popover]').popover({
            html: true,
            animation: false,
            trigger: 'hover',
            placement: 'left',
            content: function() {
                return app.renderer.simulationPopover(this)
            }
        });
        app.navigation.events()
    }, 1000)
}

module.exports = navigation;
