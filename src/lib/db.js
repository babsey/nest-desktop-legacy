"use strict"

const jsonfile = require('jsonfile');
const NeDB = require('nedb');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-idb'));
PouchDB.plugin(require('pouchdb-upsert'));
const uuidV4 = require('uuid/v4');
const path = require('path');

var db = {};

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
    data.version = process.env.npm_package_version
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
    var configApp = app.config.app()
    db.get(id).exec(function(err, doc) {
        if (err) return
        var filepath = path.join(process.cwd(), configApp.datapath, 'exports', id + '.json')
        jsonfile.writeFileSync(filepath, doc, {
            spaces: 4
        })
    })
}

db.init = function() {
    var configApp = app.config.app()
    var db_name = configApp.db.name
    var filename = path.join(process.cwd(), configApp.datapath, db_name + '.db')

    // Create a indexDB for synchroning with remoteDB if set
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
        autoload: true,
    })

    app.sync.all()
}

module.exports = db;
