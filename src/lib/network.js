"use strict"

var network = {};

network.update = () => {
    app.message.log('Update network')

    app.simulation.recorders = app.data.nodes.filter(
        (node) => node.element_type == 'recorder' && !node.disabled
    ).map(
        (node) => ({
            node: node,
            sources: app.data.links.filter(
                (link) => link.target == node.id
            ).map(
                (link) => app.data.nodes[link.source].id
            )
        })
    );

    app.simulation.recorders.map((recorder, idx) => {
        if (!recorder.node.model) return
        var recorderChart = recorder.node.chart || app.chart.fromOutputNode[recorder.node.model]
        recorder.chart = require(__dirname + '/chart/' + recorderChart)
        recorder.chart.init(idx)
        delete require.cache[require.resolve(__dirname + '/chart/' + recorderChart)]
    })

    app.simulation.stimulators = app.data.nodes.filter(
        (node) => node.element_type == 'stimulator' && !node.disabled
    ).map(
        (node) => ({
            node: node,
            targets: app.data.links.filter(
                (link) => link.source == node.id
            ).map(
                (link) => app.data.nodes[link.target].id
            )
        })
    );
}

network.clear = () => {
    delete app.data.createdAt;
    delete app.data.parentId;
    app.data.kernel = {}
    app.data.sim_time = 1000.
    app.data.nodes = [];
    app.data.links = [];
}

network.clean = () => {
    app.data.kernel = app.data.kernel || {}
    app.data.kernel.time = 0.0;
    app.data.sim_time = app.data.sim_time || 1000.0;
    app.data.nodes.map((node) => {
        node.params = node.params || {}
    })
    app.data.links.map((link) => {
        link.conn_spec = link.conn_spec || {}
        link.syn_spec = link.syn_spec || {}
    })
    app.chart.abscissa = app.data.abscissa || 'times';
}

network.edit = (drawing) => {
    app.selected_node = null;
    app.selected_link = null;
    app.chart.networkLayout.drawing = drawing;
    var networkLayout = app.config.app().chart.networkLayout
    app.chart.networkLayout.toggle(drawing || networkLayout)
    app.chart.networkLayout.update()
    if (drawing) {
        app.db.clone(app.data).then((data) => {
            app.data_original = data;
        })
        $('.nav a[href="#nodes"]').tab('show');
    }
    $('.hideOnDrawing').toggle(!drawing)
    $('.disableOnDrawing').toggleClass('disabled', drawing)
    $('#autoscale').prop('checked', 'checked')
    $('#edit-network-button').toggle(drawing)
}

network.init = () => new Promise((resolve, reject) => {
    app.message.log('Initialize network')
    if (app.protocol.id) {
        app.protocol.get(app.protocol.id)
            .exec((err, docs) => {
                app.data = docs;
                resolve()
            })
    } else {
        app.db.get(app.simulation.id)
            .exec((err, docs) => {
                app.data = docs;
                resolve()
            })
    }
}).then(() => {
    $('#title').html(app.data.name)
    network.clean()
    network.update()
})


module.exports = network;
