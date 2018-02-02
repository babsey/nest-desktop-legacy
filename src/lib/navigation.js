"use strict"

const path = require('path');
const Clipboard = require('clipboard');

var navigation = {};

navigation.update_randomSeed = () => {
    var configApp = app.config.app();
    configApp.simulation.randomSeed = app.simulation.randomSeed;
    app.config.save('app', configApp)
    $('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
}

navigation.events = () => {
    // this should be called only one time
    app.message.log('Event handler for navigation')
    // Load protocol events
    app.protocol.events()

    $('.spinOnHover').hover(function() {
        $(this).find(' .fa').addClass('fa-spin');
    }, function() {
        $(this).find(' .fa').removeClass('fa-spin');
    });
    $('#chart-color').on('click', () => {
        var color = app.config.app().graph.color || false
        var configApp = app.config.app();
        configApp.graph.color = !color;
        app.config.save('app', configApp)
        $('#chart-color').find('.glyphicon-ok').toggle(!color)
        app.graph.update()
    })
    $('#view-networkLayout').on('click', () => {
        var networkLayout = !app.config.app().graph.networkLayout || false
        var configApp = app.config.app();
        configApp.graph.networkLayout = networkLayout;
        app.config.save('app', configApp)
        app.graph.networkLayout.toggle(networkLayout)
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
    $('#edit-network').on('click', () => {
        app.protocol.add().then(() => {
            setTimeout(() => {
                app.network.edit(true)
                app.graph.update()
                app.controller.update()
            }, 200)
        })
    })
    $('#clear-network').on('click', () => {
        app.protocol.add().then(() => {
            setTimeout(() => {
                app.network.edit(true)
                app.network.clear()
                app.network.update()
                app.graph.init()
                app.controller.init()
            }, 200)
        })
    })
    $('#edit-network-clear').on('click', () => {
        app.network.clear()
        app.network.update()
        app.graph.init()
        app.controller.init()
    })
    $('#edit-network-cancel').on('click', () => {
        app.data = app.data_original;
        app.network.clean()
        app.network.update()
        app.simulation.reload()
    })
    $('#edit-network-save').on('click', () => {
        app.network.edit(false)
        app.network.clean()
        app.network.update()
        app.simulation.reload()
    })
    $('.simulation-run').on('click', app.simulation.simulate.run)
    $('#simulation-resume').on('click', app.simulation.resume.start)
    $('#simulation-clone').on('click', (e) => {
        $('#simulation-clone-submit').show()
        var simulationForm = $('#simulation-form');
        simulationForm.find('#simulation-name').attr('disabled', false).focus()
        simulationForm.find('#simulation-description').hide()
    })
    $('.simulation-edit').on('click', (e) => {
        $('#simulation-edit-submit').show()
        var simulationForm = $('#simulation-form');
        simulationForm.find('#simulation-name').val(app.data.name).attr('disabled', 'disabled')
        simulationForm.find('#simulation-description').show().val(app.data.description).focus()
    })
    $('#simulation-form-dialog').on('hidden.bs.modal', (e) => {
        $('#simulation-form button[type="submit"]').hide()
    })
    $('#simulation-clone-submit').on('click', function(e) {
        var simulationForm = $('#simulation-form');
        var simulationName = simulationForm.find('#simulation-name').val();
        if (simulationName.length == 0) return
        $(this).hide(() => {
            app.db.clone(app.data).then((data) => {
                data.name = simulationName;
                app.db.add(data).then(() => {
                    location.href = 'simulation.html?simulation=' + data._id;
                });
            });
        })
    })
    $('#simulation-edit-submit').on('click', function(e) {
        $(this).hide(() => {
            app.data.description = $('#simulation-form #simulation-description').val();
            $('.description').html(app.data.description)
            app.protocol.add(app.data)
        })
    })
    $('#delete-protocol').on('click', app.protocol.delete)
    $('#delete-all-protocols-dialog').on('shown.bs.modal', function() {
        $('#delete-all-protocols-cancel').trigger('focus')
    })
    $('#capture-screen').on('click', () => {
        app.screen.capture(app.data, true)
        app.protocol.update()
    })
    $('.printToPDF').on('click', (e) => {
        var configApp = app.config.app();
        var filename = app.data._id + '.pdf';
        var filepath = path.join(process.cwd(), configApp.datapath);
        $('#pdf-form #pdf-filename').val(filename).focus();
        $('#pdf-form #pdf-filepath').val(filepath);
        $('#pdf-description').prop('checked', app.data.description != undefined)
        $('#pdf-description').prop('disabled', app.data.description == undefined)
    })
    $('#pdf-submit').on('click', function(e) {
        var filename = $('#pdf-form #pdf-filename').val();
        var filepath = $('#pdf-form #pdf-filepath').val();
        app.print.toPDF(filename, filepath);
    })
    $('.level').on('click', function() {
        var configApp = app.config.app();
        configApp.simulation.level = parseInt($(this).attr('level'));
        $('.level').find('.glyphicon-ok').hide()
        $('.level[level='+ configApp.simulation.level +']').find('.glyphicon-ok').show()
        app.config.save('app', configApp)
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

    new Clipboard('#copy');
}

navigation.update = () => {
    app.message.log('Update navigation')
    $('.title').html(app.data.name)
    $('.description').html(app.data.description)

    // Load simulation list
    $('#get-simulation-list').prop('disabled', true)
    $('#simulation-list').empty()
    $('#simulation-list').append('<li><a href="../index.html"><i class="fa fa-home"></i> Go to overview page</a></li>')
    $('#simulation-list').append('<li class="divider"></li>')
    $('#simulation-list').append('<li class="dropdown-header">List of simulations</li>')
    app.db.filter({
        _id: {
            $ne: app.simulation.id
        },
        group: app.data.group,
    }).sort({
        name: 1
    }).exec((err, docs) => {
        if (docs.length == 0) return
        docs.map((doc) => {
            $('#simulation-list').append(app.renderer.simulation.dropdown(doc))
            $('#simulation-list #' + doc._id).popover({
                container: 'body',
                html: true,
                animation: false,
                trigger: 'hover',
                placement: 'left',
                content: function() {
                    return app.renderer.simulation.popover(doc)
                }
            });
        });
        $('#get-simulation-list').prop('disabled', false)
        $('.simulation').on('click', function(d) {
            location.href = location.origin + location.pathname + '?simulation=' + this.id
        })
    })
    app.network.edit((app.data.nodes.length == 0))
    $('.simulation-edit').toggle(app.protocol.id != undefined)
}

navigation.init = () => {
    app.message.log('Initialize navigation')
    app.simulation.runAfterChange = app.config.app().simulation.runAfterChange || false;
    app.simulation.autoReset = app.config.app().simulation.autoReset || false;
    app.simulation.randomSeed = app.config.app().simulation.randomSeed || false;
    app.simulation.autoProtocol = app.config.app().simulation.autoProtocol || false;
    $(".config").find('#chart-color').find('.glyphicon-ok').toggle(app.config.app().graph.color || false)
    $(".config").find('#run-after-change').find('.glyphicon-ok').toggle(app.simulation.runAfterChange)
    $(".config").find('#auto-reset').find('.glyphicon-ok').toggle(app.simulation.autoReset)
    $(".config").find('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
    $(".config").find('#auto-protocol').find('.glyphicon-ok').toggle(app.simulation.autoProtocol)
    $(".config").find('.color[data-group=' + app.config.app().graph.color.group + ']').find('.glyphicon-ok').show()
    $('.level[level=' + app.config.app().simulation.level + ']').find('.glyphicon-ok').show()
    app.navigation.events()
}

module.exports = navigation;
