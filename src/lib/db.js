"use strict"

const jsonfile = require('jsonfile');
const NeDB = require('nedb');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
const uuidV4 = require('uuid/v4');
const path = require('path');

var db = {};

db.all = function() {
    return db.localDB.find({}).sort({
        updatedAt: -1
    })
}

db.filter = function() {
    return db.localDB.find({
        user: app.config.app().user.id
    }).sort({
        updatedAt: -1
    })
}

db.labels = function() {
    db.all().exec(function(err, docs) {
        docs.map(function(doc) {
            console.log(doc._id)
        })
    })
};

db.get = function(id) {
    return db.localDB.findOne({
        _id: id
    })
}

db.clone = function(data) {
    return $.extend(true, {}, app.data);
}

db.clean = function(data) {
    delete data._rev
    delete data.kernel.local_num_threads
    delete data.kernel.time
    data.nodes.map(function(node) {
        delete node.ids
        delete node.index
        delete node.vx
        delete node.vy
        delete node.fx
        delete node.fy
        var pkeys = Object.keys(node.params);
        pkeys.map(function(pkey) {
            if (typeof(node.params[pkey]) == 'object') {
                delete node.params[pkey]
            }
        })
    })
}

db.update = function(data) {
    db.clean(data);
    var date = new Date;
    data.updatedAt = date;
    data.user = app.config.app().user.id;
    data.group = 'public';
    data.version = process.env.npm_package_version;
    db.localDB.update({
        _id: data._id
    }, data, {}, function() {});
    data.hash = app.hash(data);
}

db.add = function(data) {
    db.clean(data);
    data.parentId = data._id;
    data._id = uuidV4();
    var date = new Date;
    data.createdAt = date;
    data.updatedAt = date;
    data.user = app.config.app().user.id;
    data.group = 'public';
    data.version = process.env.npm_package_version;
    db.localDB.insert(data)
    setTimeout(function() {
        app.screen.capture(data._id)
    }, 1000)
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

    db.localDB = new NeDB({
        filename: filename,
        timestampData: true,
        autoload: true,
    })
}

module.exports = db;
