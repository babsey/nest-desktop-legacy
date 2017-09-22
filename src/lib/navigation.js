"use strict"

var navigation = {};

navigation.update_randomSeed = function() {
    var configApp = app.config.app();
    configApp.simulation.randomSeed = app.simulation.randomSeed;
    app.config.save('app', configApp)
    $('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
}

navigation.editNetwork = function(drawing) {
    if (drawing) {
        app.chart.networkLayout.drawing = drawing;
        var networkLayout = app.config.app().chart.networkLayout
        app.chart.networkLayout.toggle(drawing || networkLayout)
        app.chart.networkLayout.update()
        $('.nav-tabs a[href="#nodes"]').tab('show');
        $('.hideOnDrawing').toggle(!drawing)
        $('.disableOnDrawing').toggleClass('disabled', drawing)
        $('#edit-network-button').show()
    } else {
        app.chart.networkLayout.drawing = drawing;
        var networkLayout = app.config.app().chart.networkLayout
        app.chart.networkLayout.toggle(drawing || networkLayout)
        app.chart.networkLayout.update()
        $('.nav-tabs a[href="#nodes"]').tab('show');
        $('.hideOnDrawing').toggle(!drawing)
        $('.disableOnDrawing').toggleClass('disabled', drawing)
        $('#edit-network-button').hide()
        $('#autoscale').prop('checked', 'checked')
    }
}

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
        navigation.editNetwork(true)
    })
    $('#edit-network-cancel').on('click', function() {
        if (app.simulation.id == app.data._id) {
            var location = './simulation.html?simulation=' + app.simulation.id
        } else {
            var location = './simulation.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id
        }
        window.location = location
    })
    $('#edit-network-save').on('click', function() {
        navigation.editNetwork(false)
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
        navigation.editNetwork(true)
    })
    $('#run-after-change').on('click', function() {
        var runAfterChange = app.config.app().simulation.runAfterChange || false
        var configApp = app.config.app();
        configApp.simulation.runAfterChange = !runAfterChange;
        app.simulation.runAfterChange = !runAfterChange;
        app.config.save('app', configApp)
        $('#run-after-change').find('.glyphicon-ok').toggle(!runAfterChange)
    })
    $('#auto-reset').on('click', function() {
        var autoReset = app.config.app().simulation.autoReset || false
        var configApp = app.config.app();
        configApp.simulation.autoReset = !autoReset;
        app.simulation.autoReset = !autoReset;
        app.config.save('app', configApp)
        $('#auto-reset').find('.glyphicon-ok').toggle(!autoReset)
    })
    $('#random-seed').on('click', function() {
        var randomSeed = app.config.app().simulation.randomSeed || false
        app.simulation.randomSeed = !randomSeed;
        navigation.update_randomSeed()
    })
    $('.simulation-run').on('click', app.simulation.simulate)
    $('#simulation-reset').on('click', app.simulation.reset)
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
    $('#simulation-config-button').on('click', function() {
        if (app.data.group == 'user') {
            $('#simulation-edit').show()
        } else {
            $('#simulation-edit').hide()
        }
    })
    $('#simulation-add').on('click', function(e) {
        $('#simulation-add-submit').show()
        setTimeout(function() {
            $('#simulation-form #simulation-name').focus()
        }, 1000)
    })
    $('#simulation-add-submit').on('click', function(e) {
        $(this).hide()
        var data = app.db.clone(app.data);
        data.name = $('#simulation-form #simulation-name').val();
        data.description = $('#simulation-form #simulation-description').val();
        app.db.add(data)
        app.simulation.id = data._id
        $('#title').html(data.name)
        app.navigation.update()
    })
    $('#simulation-edit').on('click', function(e) {
        $('#simulation-form #simulation-name').val(app.data.name)
        $('#simulation-form #simulation-description').val(app.data.description)
        if (app.data.group = 'user') {
            $('#simulation-edit-submit').show()
        }
    })
    $('#simulation-edit-submit').on('click', function(e) {
        $(this).hide()
        var data = app.db.clone(app.data);
        data.name = $('#simulation-form #simulation-name').val()
        data.description = $('#simulation-form #simulation-description').val()
        app.db.update(data)
        $('#title').html(data.name)
        app.navigation.update()
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

navigation.update = function() {
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

navigation.init = function() {
    app.simulation.runAfterChange = app.config.app().simulation.runAfterChange;
    app.simulation.autoReset = app.config.app().simulation.autoReset;
    app.simulation.randomSeed = app.config.app().simulation.randomSeed;
    $(".config").find('#view-protocol').find('.glyphicon-ok').toggle(app.config.app().simulation.protocol || false)
    $(".config").find('#chart-color').find('.glyphicon-ok').toggle(app.config.app().chart.color || false)
    $(".config").find('#run-after-change').find('.glyphicon-ok').toggle(app.config.app().simulation.runAfterChange || false)
    $(".config").find('#auto-reset').find('.glyphicon-ok').toggle(app.config.app().simulation.autoReset || false)
    $(".config").find('#random-seed').find('.glyphicon-ok').toggle(app.config.app().simulation.randomSeed || false)
    $(".config").find('.color[data-group=' + app.config.app().chart.color.group + ']').find('.glyphicon-ok').show()
    $("#slider-config").find('#level_' + app.config.app().simulation.level).find('.glyphicon-ok').show()

    navigation.update()

}

module.exports = navigation;
