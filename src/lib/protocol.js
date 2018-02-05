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

protocol.backup = () => new Promise((resolve, reject) => {
    protocol.all().exec((err, docs) => {
        if (err) reject()
        var d = new Date();
        var date = d.toISOString();
        var filename = path.join(process.cwd(), configApp.datapath, 'protocols', '.' + date + '_' + app.simulation.id + '.backup')
        var backupDB = new NeDB({
            filename: filename,
            timestampData: true,
            autoload: true,
        })
        backupDB.insert(docs, (err, docs) => {
            console.log('Backup successful: ' + docs.length + ' protocol docs')
            resolve()
        })
    })
})

protocol.delete = () => protocol.db.remove({
    '_id': app.data._id
}, {
    multi: true
}, function(err, numDeleted) {
    console.log('Deleted', numDeleted, 'protocol(s)')
    window.location = './simulation.html?simulation=' + app.simulation.id
})

protocol.deleteAll = () => protocol.backup().then(() => {
    protocol.db.remove({}, {
        multi: true
    }, function(err, numDeleted) {
        console.log('Deleted', numDeleted, 'protocol(s)')
        window.location = './simulation.html?simulation=' + app.simulation.id
    })
})

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
        placement: 'right',
        trigger: 'hover',
        content: app.renderer.protocol.popover(data)
    });
    $('#' + data._id).on('click', (e) => {
        e.preventDefault()
        app.network.edit(false)
        app.protocol.id = data._id;
        app.network.init().then(() => {
            app.graph.init()
            app.controller.init()
            app.simulation.update()
        })
    })
}

protocol.removeDropdown = (data) => $('#' + data._id).remove();

protocol.add = () => {
    var configApp = app.config.app()
    return app.db.clone(app.data).then((data) => {
        data.user = configApp.user.id;
        data.version = process.env.npm_package_version;
        var description = data.description;
        app.db.clean(data);
        delete data._id;
        delete data.updatedAt;

        return new Promise((resolve, reject) => {
            protocol.db.findOne({
                hash: data.hash
            }).exec((err, doc) => {
                // console.log(doc)
                if (doc) {
                    if (description == undefined) {
                        description = doc.description
                    }
                    // console.log('Update protocol')
                    data.description = description
                    protocol.db.update({
                        hash: data.hash,
                    }, data, {}, () => {
                        protocol.db.findOne({
                            hash: data.hash
                        }).exec((err, doc) => {
                            app.data._id = doc._id;
                            app.protocol.id = app.data._id;
                            app.data.updatedAt = doc.updatedAt;
                            app.data.description = doc.description;
                            resolve(false)
                        })
                    })
                } else {
                    // console.log('Insert protocol')
                    protocol.db.insert(data, (err, newDocs) => {
                        app.data._id = newDocs._id;
                        app.protocol.id = newDocs._id;
                        app.data.updatedAt = newDocs.updatedAt;
                        resolve(true)
                    })
                }
            })
        }).then((capture) => {
            if (capture) {
                app.screen.capture(app.data, false)
            }
            protocol.update()
            app.navigation.update()
        })
    });
}

protocol.update = () => {
    app.message.log('Update protocol')
    app.protocol.all().sort({
        updatedAt: -1
    }).exec((err, docs) => {
        $('#protocol-list').empty()
        $('#protocol-label').html('No protocol')
        if (docs.length == 0) return
        docs.map((doc, idx) => {
            protocol.addDropdown(doc)
        })
        $('#protocol-label').html(app.format.datetime(app.data.updatedAt))
    })
}

protocol.events = () => {
    $('.protocol').on('click', () => {
        if (app.graph.networkLayout.drawing) return
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

protocol.count = (id) => {
    var configApp = app.config.app()
    var filename = path.join(process.cwd(), configApp.datapath, 'protocols', id + '.db')
    var db = new NeDB({
        filename: filename,
        autoload: true,
    })
    return db.count({})
}

module.exports = protocol
