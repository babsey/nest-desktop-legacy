"use strict"

const Clipboard = require('clipboard');

var navigation = {};

navigation.events = () => {
    // this should be called only one time
    app.message.log('Event handler for navigation')

    $('.spinOnHover').hover(function() {
        $(this).find(' .fa').addClass('fa-spin');
    }, function() {
        $(this).find(' .fa').removeClass('fa-spin');
    });

    // Load events
    app.config.events()
    app.network.events()
    app.simulation.events()
    app.protocol.events()
    app.controller.events()
    app.print.events()
    new Clipboard('#copy');
}

navigation.update = () => {
    app.message.log('Update navigation')
    $('.title').html(app.data.name)
    $('#title').attr('data-content', app.data.description)
    $('.description').html(app.data.description)

    // Load simulation list
    $('#get-simulation-list').prop('disabled', true)
    $('#simulation-list').empty()
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
            app.protocol.count(doc._id).exec((err, count) => {
                if (count > 0) {
                    app.protocol.latest(doc._id).exec((err, protocols) => {
                        var href = $('#simulation-list #' + doc._id).attr('href');
                        $('#simulation-list #' + doc._id).attr('href', (href + '&protocol=' + protocols[0]._id))
                    })
                }
            })
            $('#simulation-list #' + doc._id).popover({
                container: 'body',
                html: true,
                animation: false,
                trigger: 'hover',
                placement: 'right',
                content: function() {
                    return app.renderer.simulation.popover(doc)
                }
            });
        });
        $('#get-simulation-list').prop('disabled', false)
        // $('.simulation').on('click', function(d) {
        //     location.href = location.origin + location.pathname + '?simulation=' + this.id
        // })
    })
    $('.description-edit').toggle(app.protocol.id != undefined)

    var href = './simulation.html?simulation=' + app.simulation.id;
    if (app.protocol.id) {
        href += '&protocol=' + app.protocol.id;
    }
    $("#reload").attr('href', href)
}

navigation.init = () => {
    app.message.log('Initialize navigation')
    var configApp = app.config.app();
    app.simulation.autoSimulation = configApp.simulation.autoSimulation || false;
    app.simulation.autoReset = configApp.simulation.autoReset || false;
    app.simulation.randomSeed = configApp.simulation.randomSeed || false;
    app.simulation.autoProtocol = configApp.simulation.autoProtocol || false;
    $(".config").find('#chart-color').find('.check').toggle(configApp.graph.color || false)
    $(".config").find('#auto-simulation').find('.check').toggle(app.simulation.autoSimulation)
    $('button.simulation-run').toggleClass('active', app.simulation.autoSimulation)
    $(".config").find('#auto-reset').find('.check').toggle(app.simulation.autoReset)
    $(".config").find('#random-seed').find('.check').toggle(app.simulation.randomSeed)
    $(".config").find('#auto-protocol').find('.check').toggle(app.simulation.autoProtocol)
    $('button.protocol').toggleClass('active', app.simulation.autoProtocol)
    $(".config").find('.color[data-group=' + configApp.graph.color.group + ']').find('.check').show()
    $('.level[level=' + app.config.app().controller.level + ']').find('.check').show()
    app.navigation.events()
}

module.exports = navigation;
