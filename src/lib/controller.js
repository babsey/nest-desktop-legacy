"use strict"

var controller = {
    simulation: require('./controller/simulation'),
    kernel: require('./controller/kernel'),
    node: require('./controller/node'),
    connection: require('./controller/connection'),
    synapse: require('./controller/synapse'),
};

controller.dropdown = () => {
    $(document).on("shown.bs.dropdown", ".dropdown", function() {
        // calculate the required sizes, spaces
        var $ul = $(this).children(".dropdown-menu");
        var $button = $(this).children(".dropdown-toggle");
        var ulOffset = $ul.offset();
        // how much space would be left on the top if the dropdown opened that direction
        var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
        // how much space is left at the bottom
        var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
        // switch to dropup only if there is no space at the bottom AND there is space at the top, or there isn't either but it would be still better fit
        if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown))
            $(this).addClass("dropup");
    }).on("hidden.bs.dropdown", ".dropdown", function() {
        // always reset after close
        $(this).removeClass("dropup");
    });
}

controller.collapse = () => {
    $('#globalConfig').on('show.bs.collapse', () => {
        $('#simulation .dataSlider').collapse('hide')
        $('#kernel .dataSlider').collapse('hide')
    })

    $('#globalConfig').on('shown.bs.collapse', () => {
        controller.updateHeight()
    })

    $('#globalConfig').on('hidden.bs.collapse', () => {
        controller.updateHeight()
    })
}

controller.initNodes = () => {
    $('#nodes .controller').empty()
    $('#nodeSpy .nav').empty()
    app.data.nodes.map((node) => controller.node.init(node))
}

controller.initLinks = () => {
    var drawing = app.graph.networkLayout.drawing;
    if (!drawing) {
        $('#connections .controller').empty();
        $('#synapses .controller').empty();
        app.data.links.map((link) => {
            if (!app.data.nodes[link.source] || !app.data.nodes[link.target]) return
            if (app.data.nodes[link.source].hidden || app.data.nodes[link.target].hidden) return
            if (app.data.nodes[link.source].disabled || app.data.nodes[link.target].disabled) return
            // if (app.data.nodes[link.target].element_type == 'recorder') return
            controller.connection.init(link)
            controller.synapse.init(link)
        })
    }
    $('.hideOnDrawing').toggle(!drawing);
    $('.showOnDrawing').toggle(drawing);
}

controller.updateHeight = () => {
    var height = window.innerHeight - $('.tab-content')[0].offsetTop - 55;
    $('.tab-content').css('height', height + 'px')
    $('.tab-content').css('max-height', height + 'px')
}

controller.update = () => {
    app.message.log('Update controller')
    controller.simulation.updateAll()
    controller.updateHeight()

    $('.node').removeClass('active');
    $('.controller').find('.node').show()
    $('.controller').find('.link').show()
    if (app.graph.networkLayout.drawing) return

    if (app.selected_node) {
        $('.controller').find('.node').hide()
        $('.controller').find('.link').hide()
        $('.node[data-id="' + app.selected_node.id + '"]').addClass('active');
        $('.controller').find('.node[data-id="' + app.selected_node.id + '"]').show()
        $('.controller').find('.link[data-source="' + app.selected_node.id + '"]').show()
        $('.controller').find('.link[data-target="' + app.selected_node.id + '"]').show()
    }
    if (app.selected_link) {
        $('.controller').find('.link').hide()
        $('.controller').find('.link[data-id="' + app.selected_link.id + '"]').show()
    }

    $('.data .nodes').empty();
    $('.data .links').empty();
    app.data.nodes.map((node) => {
        $('.data .nodes').append(app.renderer.node.table(node))
    });
    app.data.links.map((link) => {
        $('.data .links').append(app.renderer.link.table(link))
    });
    $('.data .comments').html(app.data.comments)
    $('#raw-data').html(JSON.stringify(app.data, undefined, 4))
    $('#' + app.controller.activeElement).find('.' + app.controller.activeElement).focus()
}

controller.init = () => {
    app.message.log('Initialize controller')
    controller.level = app.config.app().controller.level;
    controller.borderWidth = '4px';

    controller.simulation.init()
    controller.kernel.init()

    controller.initNodes()
    controller.initLinks()

    controller.update()
}

controller.events = () => {
    $('.level').on('click', function() {
        var configApp = app.config.app();
        configApp.controller.level = parseInt($(this).attr('level'));
        $('.level').find('.check').hide()
        $('.level[level=' + configApp.controller.level + ']').find('.check').show()
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
        app.slider.view_dataSlider()
        controller.update()
    })

    controller.dropdown()
    controller.collapse()
}

module.exports = controller;
