"use strict"

var navigation = {};


navigation.events = function() {

    // Load protocol events
    app.protocol.events()

    $('.spinOnHover').hover(function() {
        $(this).find(' .fa').addClass('fa-spin');
    }, function() {
        $(this).find(' .fa').removeClass('fa-spin');
    });

    $('#index').on('click', function() {
        app.simulation.stop()
        setTimeout(function() {
            window.location = "../index.html"
        }, 100)
    })
    $('#app-refresh').on('click', function() {
        app.simulation.stop()
        setTimeout(function() {
            if (app.simulation.id == app.data._id) {
                var location = './simulation.html?simulation=' + app.simulation.id
            } else {
                var location = './simulation.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id
            }
            window.location = location
        }, 100)
    })
    $('#chart-color').on('click', function() {
        var color = app.config.app().chart.color || false
        var configApp = app.config.app();
        configApp.chart.color = !color;
        app.config.save('app', configApp)
        $('#chart-color').find('.glyphicon-ok').toggle(!color)
        app.chart.update()
    })
    $('#edit-network').on('click', function() {
        var drawing = true;
        app.chart.networkLayout.drawing = drawing;
        var networkLayout = app.config.app().chart.networkLayout
        app.chart.networkLayout.toggle(drawing || networkLayout)
        app.chart.networkLayout.update()
        $('.nav-tabs a[href="#nodes"]').tab('show');
        $('.hideOnDrawing').toggle(!drawing)
        $('.disableOnDrawing').toggleClass('disabled', drawing)
        $('#edit-button').show()
    })
    $('#edit-cancel').on('click', function() {
        if (app.simulation.id == app.data._id) {
            var location = './simulation.html?simulation=' + app.simulation.id
        } else {
            var location = './simulation.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id
        }
        window.location = location
    })
    $('#edit-save').on('click', function() {
        var drawing = false;
        app.chart.networkLayout.drawing = drawing;
        var networkLayout = app.config.app().chart.networkLayout
        app.chart.networkLayout.toggle(drawing || networkLayout)
        app.chart.networkLayout.update()
        $('.nav-tabs a[href="#nodes"]').tab('show');
        $('.hideOnDrawing').toggle(!drawing)
        $('.disableOnDrawing').toggleClass('disabled', drawing)
        $('#edit-button').hide()
        $('#autoscale').prop('checked', 'checked')
        app.simulation.update()
    })
    $('#clear-network').on('click', function() {
        app.simulation.stop()
        app.selected_node = null;
        app.selected_node = null;
        app.data.nodes = []
        app.data.links = []
        app.simulation.recorders = [];
        app.simulation.update()
        var drawing = true;
        app.chart.networkLayout.drawing = drawing;
        app.chart.networkLayout.toggle(drawing)
        app.chart.networkLayout.update()
        $('.nav-tabs a[href="#nodes"]').tab('show');
        $('.hideOnDrawing').toggle(!drawing)
        $('.disableOnDrawing').toggleClass('disabled', drawing)
        $('#edit-button').show()
    })
    $('.simulation-run').on('click', app.simulation.simulate)
    $('#run-after-change').on('click', function() {
        var runAfterChange = app.config.app().simulation.runAfterChange || false
        var configApp = app.config.app();
        configApp.simulation.runAfterChange = !runAfterChange;
        app.simulation.runAfterChange = !runAfterChange;
        app.config.save('app', configApp)
        $('#run-after-change').find('.glyphicon-ok').toggle(!runAfterChange)
    })
    $('#simulation-resume').on('click', app.simulation.resumeToggle)
    $('#capture-screen').on('click', function() {
            app.screen.capture(app.data, true)
            app.protocol.update()
        })
        // $('.color').on('click', function() {
        //     var colorGroup = $(this).data('group')
        //     var configApp = app.config.app();
        //     configApp.chart.color.group = colorGroup;
        //     app.config.save('app', configApp)
        //     $('.color').find('.glyphicon-ok').hide()
        //     $('.color[data-group=' + colorGroup + ']').find('.glyphicon-ok').show()
        //     app.chart.update()
        // })
    $('#view-networkLayout').on('click', function() {
        var networkLayout = !app.config.app().chart.networkLayout || false
        var configApp = app.config.app();
        configApp.chart.networkLayout = networkLayout;
        app.config.save('app', configApp)
        app.chart.networkLayout.toggle(networkLayout)
    })
    $('.level').on('click', function() {
        $('.level').find('.glyphicon-ok').hide()
        $(this).find('.glyphicon-ok').show()
        var configApp = app.config.app()
        configApp.simulation.level = parseInt($(this).attr('level'))
        app.config.save('app', configApp)
        if (app.chart.networkLayout.drawing) return
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
        app.slider.update_dataSlider()
        app.controller.update()
    })
    $('#simulation-add-submit').on('click', function(e) {
        app.data.name = $('#simulation-add-form #simulation-name').val()
        app.data.description = $('#simulation-add-form #simulation-description').val()
        var date = new Date;
        app.data.user = app.config.app().user.name || process.env.USER;
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
    app.simulation.runAfterChange = app.config.app().simulation.runAfterChange;
    $(".config").find('#view-protocol').find('.glyphicon-ok').toggle(app.config.app().simulation.protocol || false)
    $(".config").find('#chart-color').find('.glyphicon-ok').toggle(app.config.app().chart.color || false)
    $(".config").find('#run-after-change').find('.glyphicon-ok').toggle(app.config.app().simulation.runAfterChange || false)
    $(".config").find('.color[data-group=' + app.config.app().chart.color.group + ']').find('.glyphicon-ok').show()
    $("#slider-config").find('#level_' + app.config.app().simulation.level).find('.glyphicon-ok').show()

    // Load simulation list
    $('#get-simulation-list').attr('disabled', 'disabled')
    $('#simulation-list').empty()
    var groups = app.config.app().simulation.groups;
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
