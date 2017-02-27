"use strict"

const jsonfile = require('jsonfile');
const NeDB = require('nedb');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-idb'));
PouchDB.plugin(require('pouchdb-upsert'));
const uuidV4 = require('uuid/v4');
const fs = require('fs')
const path = require('path')

var db = {};

db.init = function() {
    var config = app.config.app()
    var db_name = config.get('db.name')
    var filename = path.join(config.get('db.local.path'), db_name + '.db')

    db.indexDB = new PouchDB(db_name, {
        adapter: 'idb'
    });
    // db.indexDB.putIfNotExists({
    //     _id: '_design/app',
    //     filters: {
    //         by_network: function(doc, req) {
    //             return doc.network === req.query.network;
    //         }.toString(),
    //         by_simulation: function(doc, req) {
    //             return doc.simulation === req.query.simulation;
    //         }.toString(),
    //     }
    // })
    db.localDB = new NeDB({
        filename: filename,
        timestampData: true,
    })

    db.localDB.loadDatabase(function(err) {
        var imagePath = path.join(__dirname, '..', '..', config.get('db.local.path'), 'images');
        var exportPath = path.join(__dirname, '..', '..', config.get('db.local.path'), 'exports');
        if (!fs.existsSync(imagePath)) {
            fs.mkdirSync(imagePath)
        }
        if (!fs.existsSync(exportPath)) {
            fs.mkdirSync(exportPath)
        }
    });

    app.sync.on()
}

db.all = function() {
    return db.localDB.find({}).sort({
        updatedAt: -1
    })
}

db.get = function(id) {
    return db.localDB.findOne({
        _id: id
    })
}

db.add = function(data) {
    data.parentId = data._id;
    data._id = uuidV4();
    data._rev = null;
    data.nodes.forEach(function(node) {
        if ('events' in node) {
            node.events = {};
        }
    })
    db.indexDB.put(data)
    app.sync.localDB()

    setTimeout(function() {
        app.screen.capture(data._id)
    }, 1000)
}

db.filter_by_network = function(network) {
    return db.indexDB.changes({
        filter: 'app/by_network',
        query_params: {
            network: network
        }
    }).then(function(response) {
        return response.results.map(function(r) {
            return r.id
        })
    })
}

db.export = function(data) {
    const config = app.config.app()
    db.get(id).exec(function(err, doc) {
        if (err) return
        var filepath = path.join(__dirname, '..', '..', config.get('db.local.path'), 'exports', id + '.json')
        jsonfile.writeFileSync(filepath, doc, {
            spaces: 4
        })
    })
}

module.exports = db;
