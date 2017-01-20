"use strict"

const NeDB = require('nedb');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-idb'));
PouchDB.plugin(require('pouchdb-upsert'));
var config = require('../config').global();
const sync = require('./sync');
sync.on()

var localDB = null;
var indexDB = null;

function init() {
    var db_name = config.get('db_name')
    var filename = config.get('localDB').path + '/' + db_name + '.db'

    indexDB = new PouchDB(db_name, {
        adapter: 'idb'
    });

    indexDB.putIfNotExists({
        _id: '_design/app',
        filters: {
            by_nest_app: function(doc, req) {
                return doc.nest_app === req.query.nest_app;
            }.toString(),
            by_user: function(doc, req) {
                return doc._id === '_design/app' || doc.user === req.query.user;
            }.toString()
        }
    })

    localDB = new NeDB({
        filename: filename,
        autoload: true
    });

}

function all() {
    return indexDB.allDocs().then(function(response) {
        return response.rows
    })
}

function get(id) {
    return indexDB.get(id)
}

function add(doc) {
    doc.data.nodes.forEach(function(node) {
        if ('events' in node) {
            node.events = {};
        }
    })
    doc.user = config.store.user.name;

    indexDB.post(doc)
    localDB.insert(doc)
}

function filter_by_nest_app(nest_app) {
    return indexDB.changes({
        filter: 'app/by_nest_app',
        query_params: {
            nest_app: nest_app
        }
    }).then(function(response) {
        return response.results.map(function(r) {
            return r.id
        })
    })
}

init()
module.exports = {
    init: init,
    all: all,
    get: get,
    add: add,
    filter_by_nest_app: filter_by_nest_app
}
