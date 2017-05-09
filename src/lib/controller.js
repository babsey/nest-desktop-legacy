"use strict"

var controller = {
    simulation: require('./controller/simulation'),
    kernel: require('./controller/kernel'),
    node: require('./controller/node'),
    connection: require('./controller/connection'),
    synapse: require('./controller/synapse'),
};

controller.initNodes = function() {
    $('#nodes .controller').empty()
    $('#nodeScrollspy .nav').empty()
    app.data.nodes.map(function(node) {
        controller.node.init(node)
    })
}

controller.initLinks = function() {
    var drawing = app.chart.networkLayout.drawing;
    if (!drawing) {
        $('#connections .controller').empty();
        $('#synapses .controller').empty();
        app.data.links.map(function(link) {
            if (app.data.nodes[link.source].hidden || app.data.nodes[link.target].hidden) return
            if (app.data.nodes[link.source].disabled || app.data.nodes[link.target].disabled) return
            // if (app.data.nodes[link.target].element_type == 'recorder') return
            controller.connection.init(link)
            controller.synapse.init(link)
        })
    }
    $('.hideOnDrawing').toggle(!drawing)
}

controller.update = function () {
    controller.simulation.update()
    controller.height = window.innerHeight - $('.tab-content')[0].offsetTop - 10
    $('.tab-content').css('max-height', controller.height+'px')
}

controller.init = function() {
    controller.colors = app.chart.colors();
    controller.borderWidth = '4px';

    controller.simulation.init()
    controller.kernel.init()

    controller.initNodes()
    controller.initLinks()
}

module.exports = controller;
