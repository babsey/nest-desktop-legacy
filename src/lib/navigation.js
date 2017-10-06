"use strict"

var navigation = {};

navigation.update_randomSeed = () => {
    var configApp = app.config.app();
    configApp.simulation.randomSeed = app.simulation.randomSeed;
    app.config.save('app', configApp)
    $('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
}

navigation.editNetwork = (drawing) => {
    // app.message.clear()
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

navigation.events = () => {

    // Load protocol events
    app.protocol.events()

    $('.spinOnHover').hover(function() {
        $(this).find(' .fa').addClass('fa-spin');
    }, function() {
        $(this).find(' .fa').removeClass('fa-spin');
    });

    $('#index').on('click', () => {
        app.simulation.stop().then(() => {
            window.location = "../index.html"
        })
    })
    $('#app-refresh').on('click', () => {
        app.simulation.stop().then(() => {
            if (app.simulation.id == app.data._id) {
                var location = './simulation.html?simulation=' + app.simulation.id
            } else {
                var location = './simulation.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id
            }
            window.location = location
        })
    })
    $('#chart-color').on('click', () => {
        var color = app.config.app().chart.color || false
        var configApp = app.config.app();
        configApp.chart.color = !color;
        app.config.save('app', configApp)
        $('#chart-color').find('.glyphicon-ok').toggle(!color)
        app.chart.update()
    })
    $('#view-networkLayout').on('click', () => {
        var networkLayout = !app.config.app().chart.networkLayout || false
        var configApp = app.config.app();
        configApp.chart.networkLayout = networkLayout;
        app.config.save('app', configApp)
        app.chart.networkLayout.toggle(networkLayout)
    })
    $('#edit-network').on('click', () => {
        navigation.editNetwork(true)
    })
    $('#edit-network-cancel').on('click', () => {
        if (app.simulation.id == app.data._id) {
            var location = './simulation.html?simulation=' + app.simulation.id
        } else {
            var location = './simulation.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id
        }
        window.location = location
    })
    $('#edit-network-save').on('click', () => {
        navigation.editNetwork(false)
        app.chart.init()
        setTimeout(app.simulation.update, 100)
    })
    $('#clear-network').on('click', () => {
        app.simulation.stop()
        app.selected_node = null;
        app.selected_node = null;
        app.data.nodes = []
        app.data.links = []
        app.simulation.recorders = [];
        app.chart.init()
        app.controller.init()
        app.network.update()
        app.simulation.update()
        navigation.editNetwork(true)
    })
    $('#simulation-config-button').on('click', () => {
        if (app.data.user === app.config.app().user.id) {
            $('#simulation-edit').show()
        }
    })
    $('#run-after-change').on('click', () => {
        var configApp = app.config.app();
        var runAfterChange = configApp.simulation.runAfterChange || false
        configApp.simulation.runAfterChange = !runAfterChange;
        app.simulation.runAfterChange = !runAfterChange;
        app.config.save('app', configApp)
        $('#run-after-change').find('.glyphicon-ok').toggle(!runAfterChange)
    })
    $('#auto-reset').on('click', () => {
        var configApp = app.config.app();
        var autoReset = configApp.simulation.autoReset || false
        configApp.simulation.autoReset = !autoReset;
        app.simulation.autoReset = !autoReset;
        app.config.save('app', configApp)
        $('#auto-reset').find('.glyphicon-ok').toggle(!autoReset)
    })
    $('#random-seed').on('click', () => {
        var randomSeed = app.config.app().simulation.randomSeed || false
        app.simulation.randomSeed = !randomSeed;
        navigation.update_randomSeed()
    })
    $('#auto-protocol').on('click', () => {
        var configApp = app.config.app();
        var autoProtocol = configApp.simulation.autoProtocol || false
        configApp.simulation.autoProtocol = !autoProtocol;
        app.simulation.autoProtocol = !autoProtocol;
        app.config.save('app', configApp)
        $('#auto-protocol').find('.glyphicon-ok').toggle(!autoProtocol)
    })
    $('.simulation-run').on('click', app.simulation.simulate)
    $('#simulation-reset').on('click', app.simulation.reset)
    $('#simulation-resume').on('click', app.simulation.resumeToggle)
    $('#capture-screen').on('click', () => {
        app.screen.capture(app.data, true)
        app.protocol.update()
    })
    $('#view-data').on('click', () => {
        app.protocol.add().then(() => {
            location.href = 'view_data.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id;
        });
    })
    $('#view-raw-data').on('click', () => {
        app.protocol.add().then(() => {
            window.location = 'view_raw_data.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id;
        });
    })
    $('#simulation-add').on('click', (e) => {
        $('#simulation-add-submit').show()
        $('#simulation-form #simulation-name').focus()
    })
    $('#simulation-add-submit').on('click', function(e) {
        $(this).hide()
        app.db.clone(app.data).then((data) => {
            data.name = $('#simulation-form #simulation-name').val();
            data.description = $('#simulation-form #simulation-description').val();
            app.db.add(data)
            app.simulation.id = data._id
            $('#title').html(data.name)
            app.navigation.update()
        });
    })
    $('#simulation-edit').on('click', (e) => {
        $('#simulation-form #simulation-name').val(app.data.name)
        $('#simulation-form #simulation-description').val(app.data.description)
        if (app.data.group = 'user') {
            $('#simulation-edit-submit').show()
        }
    })
    $('#simulation-edit-submit').on('click', function(e) {
        $(this).hide()
        app.db.clone(app.data).then((data) => {
            data.name = $('#simulation-form #simulation-name').val()
            data.description = $('#simulation-form #simulation-description').val()
            app.db.update(data)
            $('#title').html(data.name)
            app.navigation.update()
        });
    })
    $('.simulation').on('click', function(d) {
        app.simulation.stop()
        // app.simulation.id = this.id
        // app.simulation.init()
        location.href = location.origin + location.pathname + '?simulation=' + this.id
    })
    $('#close').on('click', () => {
        app.simulation.stop()
        setTimeout(window.close, 100)
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
}

navigation.update = () => {
    app.message.log('Update navigation')
    // Load simulation list
    $('#get-simulation-list').attr('disabled', 'disabled')
    $('#simulation-list').empty()
    app.db.filter({
        _id: {
            $ne: app.data._id
        },
        group: app.data.group,
    }).sort({
        name: 1
    }).exec((err, docs) => {
        if (docs.length == 0) return
        docs.map((doc) => {
            $('#simulation-list').append(app.renderer.simulationDropdown(doc))
        });
    })
    $('#get-simulation-list').attr('disabled', false)

    setTimeout(() => {
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

    navigation.editNetwork((app.data.nodes.length == 0))
}

navigation.init = () => {
    app.message.log('Initialize navigation')
    app.simulation.runAfterChange = app.config.app().simulation.runAfterChange || false;
    app.simulation.autoReset = app.config.app().simulation.autoReset || false;
    app.simulation.randomSeed = app.config.app().simulation.randomSeed|| false;
    app.simulation.autoProtocol = app.config.app().simulation.autoProtocol || false;
    $(".config").find('#chart-color').find('.glyphicon-ok').toggle(app.config.app().chart.color || false)
    $(".config").find('#run-after-change').find('.glyphicon-ok').toggle(app.simulation.runAfterChange)
    $(".config").find('#auto-reset').find('.glyphicon-ok').toggle(app.simulation.autoReset)
    $(".config").find('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
    $(".config").find('#auto-protocol').find('.glyphicon-ok').toggle(app.simulation.autoProtocol)
    $(".config").find('.color[data-group=' + app.config.app().chart.color.group + ']').find('.glyphicon-ok').show()
    $("#slider-config").find('#level_' + app.config.app().simulation.level).find('.glyphicon-ok').show()
    // navigation.update()
}

module.exports = navigation;
