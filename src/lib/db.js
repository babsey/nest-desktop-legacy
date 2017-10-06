"use strict"

const jsonfile = require('jsonfile');
const NeDB = require('nedb');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
const uuidV4 = require('uuid/v4');
const path = require('path');

var db = {};

db.all = () => db.localDB.find({}).sort({
    updatedAt: -1
});

db.filter = (q) => db.localDB.find(q).sort({
    updatedAt: -1
});

db.labels = () => {
    db.all().exec((err, docs) => {
        docs.map((doc) => {
            console.log(doc._id)
        })
    })
};

db.get = (id) => db.localDB.findOne({
    _id: id
});

db.clone = (data) => new Promise((resolve, reject) => {
    var clonedData = $.extend(true, {}, data);
    resolve(clonedData)
})

db.clean = (data) => {
    delete data._rev
    delete data.kernel.local_num_threads
    delete data.kernel.time
    data.nodes.map((node) => {
        delete node.ids
        delete node.index
        delete node.vx
        delete node.vy
        delete node.fx
        delete node.fy
        var pkeys = Object.keys(node.params);
        pkeys.map((pkey) => {
            if (typeof(node.params[pkey]) == 'object') {
                delete node.params[pkey]
            }
        })
    })
    data.hash = app.hash(data);
}

db.update = (data) => {
    app.message.log('Update database')
    db.clean(data);
    var date = new Date;
    data.updatedAt = date;
    data.user = app.config.app().user.id;
    data.group = 'public';
    data.version = process.env.npm_package_version;
    db.localDB.update({
        _id: data._id
    }, data, {}, () => {});
    data.hash = app.hash(data);
}

db.add = (data) => {
    db.clean(data);
    data.parentId = data._id;
    data._id = uuidV4();
    var date = new Date;
    data.createdAt = date;
    data.updatedAt = date;
    data.user = app.config.app().user.id;
    data.group = 'public';
    data.version = process.env.npm_package_version;
    db.localDB.insert(data, (err, newDocs) => {
        app.screen.capture(newDocs, true)
    })
}

db.export = (data) => {
    var configApp = app.config.app()
    db.get(id).exec((err, doc) => {
        if (err) return
        var filepath = path.join(process.cwd(), configApp.datapath, 'exports', id + '.json')
        jsonfile.writeFileSync(filepath, doc, {
            spaces: 4
        })
    })
}

db.init = () => {
    app.message.log('Initialize database')
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
