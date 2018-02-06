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

    // Load protocol events
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
    $('button.simulation-run').toggleClass('active', app.simulation.runAfterChange)
    $(".config").find('#auto-reset').find('.glyphicon-ok').toggle(app.simulation.autoReset)
    $(".config").find('#random-seed').find('.glyphicon-ok').toggle(app.simulation.randomSeed)
    $(".config").find('#auto-protocol').find('.glyphicon-ok').toggle(app.simulation.autoProtocol)
    $('button.protocol').toggleClass('active', app.simulation.autoProtocol)
    $(".config").find('.color[data-group=' + app.config.app().graph.color.group + ']').find('.glyphicon-ok').show()
    $('.level[level=' + app.config.app().simulation.level + ']').find('.glyphicon-ok').show()
    app.navigation.events()
}

module.exports = navigation;
