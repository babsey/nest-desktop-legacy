"use strict"

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
const hash = require('object-hash');
const fs = require('fs');
const jsonfile = require('jsonfile');

var sync = {};

sync.remoteDB = function() {
    var configApp = app.config.app();
    if (!(configApp.db.remote.host)) return

    let {
        host,
        port
    } = configApp.db.remote;

    configApp.simulation.groups.map(function(group) {
        // console.log(group)
        var remoteDB = new PouchDB('http://' + host + ':' + port + '/' + group.id);
        remoteDB.allDocs({
            include_docs: true
        }).then(function(remoteDocs) {
            if (remoteDocs.total_rows == 0) return
            // console.log(remoteDocs.rows)
            remoteDocs.rows.map(function(remoteRow) {
                var remoteDoc = remoteRow.doc;
                if (remoteDoc._id.startsWith('_design')) return
                // if ((group == 'public') && (remoteDoc.user != configApp.user.id)) return
                // console.log(remoteDoc)
                app.db.localDB.findOne({
                    _id: remoteDoc._id,
                }).exec(function(err, localDoc) {
                    if (localDoc != null) return
                    // console.log(remoteDoc)
                    remoteDoc.updatedAt = new Date;
                    app.db.localDB.insert(remoteDoc)
                })
            })
        })
    })

    var remoteDB = new PouchDB('http://' + host + ':' + port + '/' + configApp.user.group);
    app.db.filter().exec(function(err, localDocs) {
        if (localDocs.length == 0) return
        // console.log(localDocs)
        localDocs.map(function(localDoc) {
            if (localDoc.user != configApp.user.id) return
            // console.log(localDoc)
            remoteDB.putIfNotExists(localDoc._id, localDoc)
        })
    });
}

sync.init = function() {
    var simulation_list = fs.readdirSync(path.join(app.__dirname, 'simulations'))

    simulation_list.filter(function(filename) {
        return filename.endsWith('.json')
    }).map(function(file) {
        var name = file.split('.')[0]
        var sim = jsonfile.readFileSync(path.join(app.__dirname, 'simulations', name + '.json'))
        app.db.localDB.findOne({
            _id: sim._id
        }).exec(function(err, docs) {
            sim.version = process.env.npm_package_version
            if (docs == null) {
                app.db.localDB.insert(sim)
            } else if (app.hash(docs) != app.hash(sim)) {
                app.db.localDB.update({
                    _id: docs._id
                }, sim)
            }
        })
    })
}

module.exports = sync;
