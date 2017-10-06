"use strict"

const NeDB = require('nedb');
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile')

var protocol = {};

protocol.all = () => protocol.db.find({});
protocol.get = (id) => protocol.db.findOne({
    _id: id
});

protocol.addDropdown = (data) => {
    var configApp = app.config.app();
    if (fs.existsSync(path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png'))) {
        var src = path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png');
    } else {
        var src = path.join(__dirname, '..', 'assets', 'img', 'simulation_default.png');
    }
    var datetime = app.format.datetime(data.updatedAt)
    $('#protocol-list').append('<li><a href="#" data-id="' + data._id + '" id="' + data._id + '" data-img="' + src + '" rel="popover" class="protocol">' + datetime + '</a></li>')
    $('#' + data._id).popover({
        html: true,
        animation: false,
        trigger: 'hover',
        content: app.renderer.simulationProtocol(data)
    });
    $('#' + data._id).on('click', (e) => {
        e.preventDefault()
        app.data = data;
        $('#protocol-label').html(datetime)
        app.navigation.editNetwork(false)
        app.chart.init()
        app.simulation.update()
    })
}

protocol.removeDropdown = (data) => {
    $('#' + data._id).remove()
    // protocol.addDropdown(data)
}

protocol.add = () => {
    var configApp = app.config.app()
    return app.db.clone(app.data).then((data) => {
        data.user = configApp.user.id;
        data.version = process.env.npm_package_version;
        app.db.clean(data);
        delete data.updatedAt;

        return new Promise((resolve, reject) => {
            protocol.db.findOne({
                hash: data.hash
            }).exec((err, doc) => {
                // console.log(doc)
                if (doc) {
                    protocol.db.update({
                        hash: data.hash,
                    }, data, {}, () => {
                        protocol.db.findOne({
                            hash: data.hash
                        }).exec((err, doc) => {
                            app.data.updatedAt = doc.updatedAt
                            resolve(false)
                        })
                    })
                } else {
                    delete data._id;
                    protocol.db.insert(data, (err, newDocs) => {
                        app.data._id = newDocs._id
                        app.data.updatedAt = newDocs.updatedAt
                        resolve(true)
                    })
                }
            })
        }).then((capture) => {
            if (capture) {
                app.screen.capture(app.data, true)
            }
            protocol.update()
        })
    });
}

protocol.update = () => {
    app.message.log('Update protocol')
    $('#protocol').toggleClass('btn-primary', app.simulation.protocol || false)
    app.protocol.all().sort({
        updatedAt: -1
    }).exec((err, docs) => {
        if (docs.length == 0) return
        $('#protocol-list').empty()
        docs.map((doc, idx) => {
            protocol.addDropdown(doc)
        })
        $('#protocol-label').html(app.format.datetime(app.data.updatedAt))
    })
}

protocol.events = () => {
    $('#protocol').on('click', () => {
        if (app.chart.networkLayout.drawing) return
        protocol.add()
    })
    $('#view-protocol').on('click', () => {
        protocol.update()
    })
}

protocol.init = () => {
    app.message.log('Initialize protocol')
    var configApp = app.config.app()
    var filename = path.join(process.cwd(), configApp.datapath, 'protocols', app.simulation.id + '.db')
    protocol.db = new NeDB({
        filename: filename,
        timestampData: true,
        autoload: true,
    })
}

module.exports = protocol
