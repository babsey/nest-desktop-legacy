"use strict"

const request = require('request');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
const hash = require('object-hash');
const fs = require('fs');
const jsonfile = require('jsonfile');

var sync = {};

sync.remoteDB = () => {
    var configApp = app.config.app();
    if (configApp.db.remote.host === "") {
        app.message.log('Host of remote DB is empty.')
        return false
    }

    let {
        host,
        port
    } = configApp.db.remote;

    return request.get('http://' + host + ':' + port)
        .on('error', (err) => {
            // console.log(err)
            app.message.show('Warning', 'The connection to the remote DB failed.')
            return false
        })
        .on('response', (response) => {
            // console.log(response)
            if (!(response.headers.server.startsWith('CouchDB'))) {
                app.message.show('Warning', 'No CouchDB on server found.')
                return false
            }
            configApp.simulation.groups.map((group) => {
                // console.log(group)
                if (group.sync == false) return
                var remoteDB = new PouchDB('http://' + host + ':' + port + '/' + group.id);
                remoteDB.allDocs({
                    include_docs: true
                }).then((remoteDocs) => {
                    if (remoteDocs.total_rows == 0) return
                    // console.log(remoteDocs.rows)
                    remoteDocs.rows.map((remoteRow) => {
                        var remoteDoc = remoteRow.doc;
                        if (remoteDoc._id.startsWith('_design')) return
                        if (remoteDoc.deleted) return
                        // console.log(remoteDoc)
                        app.db.localDB.findOne({
                            _id: remoteDoc._id
                        }).exec((err, doc) => {
                            if (doc) {
                                if (!doc.updatedAt) return
                                if (Date(remoteDoc.updatedAt) <= Date(doc.updatedAt)) return
                            }
                            app.db.localDB.update({
                                _id: remoteDoc._id,
                            }, remoteDoc, {
                                upsert: true
                            }, () => {
                                app.db.localDB.findOne({
                                    _id: remoteDoc._id
                                })
                            })
                        })
                    })
                })
            })

            var remoteDB = new PouchDB('http://' + host + ':' + port + '/' + configApp.user.group);
            app.db.filter({
                user: configApp.user.id
            }).exec((err, localDocs) => {
                if (localDocs.length == 0) return
                // console.log(localDocs)
                localDocs.map((localDoc) => {
                    if (localDoc.user != configApp.user.id) return
                    if (localDoc.deleted) return
                    // console.log(localDoc)
                    remoteDB.upsert(localDoc._id, (doc) => {
                        doc = localDoc
                        return doc
                    }).catch(function(err) {
                        // error
                        remoteDB.putIfNotExists(localDoc._id, localDoc)
                    });
                })
            });
            app.message.log('Remote DB synchronized.')
            return true
        })
}

sync.init = () => {
    var simulation_list = fs.readdirSync(path.join(app.appPath, 'simulations'))

    simulation_list.filter((filename) => {
        return filename.endsWith('.json')
    }).map((file) => {
        var name = file.split('.')[0]
        var sim = jsonfile.readFileSync(path.join(app.appPath, 'simulations', name + '.json'))
        app.db.localDB.findOne({
            _id: sim._id
        }).exec((err, docs) => {
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
