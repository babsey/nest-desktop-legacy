"use strict"

const PouchDB = require('pouchdb');
const NeDB = require('nedb');
PouchDB.plugin(require('pouchdb-adapter-idb'));
const config = require('../config');
const message = require('../message');


function remoteDB() {
    if (!(config.get('remoteDB').host) || !(config.get('user').name)) return

    var db_name = config.get('db_name')

    var indexDB = new PouchDB(db_name, {
        adapter: 'idb'
    });

    let {
        host,
        port
    } = config.get('remoteDB');

    let {
        name,
        password
    } = config.get('user');

    var remoteDB = new PouchDB('http://' + host + ':' + port + '/' + db_name, {
        skip_setup: true,
        auth: {
            username: name,
            password: password
        }
    });

    var db_sync = indexDB.sync(remoteDB, {
        live: true,
        // filter: 'app/by_user',
        // query_params: {
        //     user: name
        // }
    }).on('error', function(err) {
        message('Alert', 'Synchronization to the remoted database failed.')
    })
}

function localDB() {
    var db_name = config.get('db_name')

    var indexDB = new PouchDB(db_name, {
        adapter: 'idb'
    });

    var localDB = new NeDB({
        filename: config.get('localDB').path + '/' + db_name + '.db',
    });

    indexDB.changes({
        since: 'now',
        live: true,
        include_docs: true
    }).on('change', function(change) {
        if (change.doc._deleted) return
        localDB.insert(change.doc)
    }).on('error', function(err) {
        message('Alert', 'Synchronization to the local database failed.')
    })

}

function on() {
    remoteDB()
    localDB()
}

module.exports = {
    remoteDB: remoteDB,
    localDB: localDB,
    on: on
}
