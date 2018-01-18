"use strict"

const fs = require('fs');
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
        app.protocol.add().then(() => {
            setTimeout(() => {
                app.network.edit(true)
                app.chart.update()
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
                app.chart.init()
                app.controller.init()
            }, 200)
        })
    })
    $('#edit-network-clear').on('click', () => {
        app.network.clear()
        app.network.update()
        app.chart.init()
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
    $('#delete-protocol').on('click', app.protocol.delete)
    $('#delete-all-protocols-dialog').on('shown.bs.modal', function() {
        $('#delete-all-protocols-cancel').trigger('focus')
    })
    $('.simulation-run').on('click', app.simulation.simulate.run)
    $('#simulation-resume').on('click', app.simulation.resume.start)
    $('#capture-screen').on('click', () => {
        app.screen.capture(app.data, true)
        app.protocol.update()
    })
    // $('#view-data').on('click', () => {
    //     app.protocol.add().then(() => {
    //         setTimeout(() => {
    //             location.href = 'view_data.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id;
    //         }, 200.)
    //     });
    // })
    // $('#view-raw-data').on('click', () => {
    //     app.protocol.add().then(() => {
    //         window.location = 'view_raw_data.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id;
    //     });
    // })
    $('#simulation-add').on('click', (e) => {
        $('#simulation-add-submit').show()
        $('#simulation-form #simulation-name').focus()
    })
    $('.simulation-edit').on('click', (e) => {
        $('#simulation-edit-submit').show()
        $('#simulation-form #simulation-name').val(app.data.name).focus()
        $('#simulation-form #simulation-description').val(app.data.description)
    })
    $('#printToPDF').on('click', function(e) {
        var cssPagedMedia = (function () {
            var style = document.createElement('style');
            document.head.appendChild(style);
            return function (rule) {
                style.innerHTML = rule;
            };
        }());

        cssPagedMedia.size = function (size) {
            cssPagedMedia('@page {size: ' + size + '}');
        };

        var configElectron = require(path.join(process.cwd(), 'config', 'electron.json'));

        let {
            width,
            height,
        } = configElectron.windowBounds;

        cssPagedMedia.size((width-319+480+20) +'px '+ (height) + 'px');
        var configApp = app.config.app();
        var filepath = path.join(process.cwd(), configApp.datapath, app.data._id + '.pdf')
        require('electron').remote.require('./main').printToPDF(filepath)
        setTimeout(app.simulation.update, 200)
    })
    $('#simulation-form-dialog').on('hidden.bs.modal', (e) => {
        $('button[type="submit"]').hide()
    })
    $('#simulation-add-submit').on('click', function(e) {
        $(this).hide(() => {
            if (app.data.name == $('#simulation-form #simulation-name').val()) return
            app.db.clone(app.data).then((data) => {
                data.name = $('#simulation-form #simulation-name').val();
                data.description = $('#simulation-form #simulation-description').val();
                app.db.add(data)
                $('.title').html(data.name)
                $('.description').html(data.description)
                app.navigation.update()
            });
        })
    })
    $('#simulation-edit-submit').on('click', function(e) {
        $(this).hide(() => {
            app.data.name = $('#simulation-form #simulation-name').val();
            app.data.description = $('#simulation-form #simulation-description').val();
            $('.title').html(app.data.name)
            $('.description').html(app.data.description)
            var id = app.data._id;
            app.db.update(app.data)
            app.data._id = id;
            app.navigation.update();
        })
    })
    $('.level').on('click', function() {
        $('.level').find('.glyphicon-ok').hide()
        $(this).find('.glyphicon-ok').show()
        var configApp = app.config.app();
        configApp.simulation.level = parseInt($(this).attr('level'));
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

    // Load simulation list
    $('#get-simulation-list').prop('disabled', true)
    $('#simulation-list').empty()
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
}

navigation.init = () => {
    app.message.log('Initialize navigation')
    app.simulation.runAfterChange = app.config.app().simulation.runAfterChange || false;
    app.simulation.autoReset = app.config.app().simulation.autoReset || false;
    app.simulation.randomSeed = app.config.app().simulation.randomSeed || false;
    app.simulation.autoProtocol = app.config.app().simulation.autoProtocol || false;
    $(".config").find('#chart-color').find('.glyphicon-ok').toggle(app.config.app().chart.color || false)
    $(".config").find('#run-after-change').find('.glyphicon-ok').toggle(app.simulation.runAfterChange)
    $(".config").find('#auto-reset').find('.glyphicon-ok').toggle(app.simulation.autoReset)
    $(".config").find('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
    $(".config").find('#auto-protocol').find('.glyphicon-ok').toggle(app.simulation.autoProtocol)
    $(".config").find('.color[data-group=' + app.config.app().chart.color.group + ']').find('.glyphicon-ok').show()
    $("#slider-config").find('#level_' + app.config.app().simulation.level).find('.glyphicon-ok').show()
    app.navigation.events()
}

module.exports = navigation;
