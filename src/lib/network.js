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

network.init = () => {
    app.message.log('Initialize network')
    return new Promise((resolve, reject) => {
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
        if (app.data.kernel == undefined) {
            app.data.kernel = {}
        }
        app.data.kernel.time = 0.0;
        app.data.sim_time = app.data.sim_time ? app.data.sim_time : 1000.0;
        app.data.links.map((link) => {
            link.conn_spec = link.conn_spec ? link.conn_spec : {}
            link.syn_spec = link.syn_spec ? link.syn_spec : {}
        })

        app.chart.abscissa = app.data.abscissa || 'times';

        var colors = d3.schemeCategory10;
        app.chart.colors = (id) => {
            if (id != undefined) {
                return colors[id % colors.length]
            }
            return app.data.nodes.map(
                (d) => d.color ? d.color : colors[d.id % colors.length]
            )
        }

        network.update()
    })
}


module.exports = network;
