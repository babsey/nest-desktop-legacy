"use strict"

const jsonfile = require('jsonfile');
const NeDB = require('nedb');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
const uuidV4 = require('uuid/v4');
const path = require('path');
const flat = require('flat');

var db = {};

db.all = () => db.localDB.find({
    $not: {
        deleted: true
    }
}).sort({
    updatedAt: -1
});

db.get = (id) => db.localDB.findOne({
    _id: id
});

db.filter = (q) => db.localDB.find(q).sort({
    updatedAt: -1
});

db.labels = () => db.all().exec((err, docs) => {
    docs.map((doc) => {
        console.log(doc._id)
    })
})

db.clone = (data) => new Promise((resolve, reject) => {
    var clonedData = $.extend(true, {}, data);
    resolve(clonedData)
})

db.clean = (data) => {
    delete data._rev
    if ('res_time' in data) {
        delete data.res_time
    }
    if (data.kernel) {
        if ('local_num_threads' in data.kernel) {
            delete data.kernel.local_num_threads
        }
        if ('time' in data.kernel) {
            delete data.kernel.time
        }
        if ($.isEmptyObject(data.kernel)) {
            delete data.kernel
        }
    }
    data.nodes.map((node) => {
        delete node.ids
        delete node.index
        delete node.vx
        delete node.vy
        delete node.fx
        delete node.fy
        if (node.n == 1) {
            delete node.n
        }
        if ($.isEmptyObject(node.params)) {
            delete node.params
        } else {
            var pkeys = Object.keys(node.params);
            pkeys.map((pkey) => {
                if (typeof(node.params[pkey]) == 'object') {
                    delete node.params[pkey]
                }
            })
        }

    })
    data.links.map((link) => {
        if ('conn_spec' in link) {
            if ($.isEmptyObject(link.conn_spec)) {
                delete link.conn_spec
            } else {
                if (link.conn_spec.rule == 'all_to_all') {
                    delete link.conn_spec
                }
            }
        }
        if ('syn_spec' in link) {
            if ($.isEmptyObject(link.syn_spec)) {
                delete link.syn_spec
            } else {
                if (link.syn_spec.model == 'static_synapse') {
                    delete link.syn_spec.model
                }
                if ('receptor_type' in link.syn_spec) {
                    if (link.syn_spec.receptor_type == 0) {
                        delete link.syn_spec.receptor_type
                    }
                }
                if (link.syn_spec.weight == 1) {
                    delete link.syn_spec.weight
                }
                if (link.syn_spec.delay == 1) {
                    delete link.syn_spec.delay
                }
                if ($.isEmptyObject(link.syn_spec)) {
                    delete link.syn_spec
                }
            }
        }
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
    data.hash = app.hash(data);
    delete data._id;
    db.localDB.update({
        _id: app.simulation.id
    }, data, {}, () => {
        db.localdb.findOne({
            _id: app.simulation.id
        })
    });
}

db.add = (data) => {
    db.clean(data);
    data.parentId = app.simulation.id;
    data._id = uuidV4();
    var date = new Date;
    data.createdAt = date;
    data.updatedAt = date;
    data.user = app.config.app().user.id;
    data.group = 'public';
    data.version = process.env.npm_package_version;
    db.localDB.insert(data, (err, newDocs) => {
        app.screen.capture(newDocs, false)
    })
}

db.export = (data) => {
    var configApp = app.config.app()
    var id = data._id;
    db.get(id).exec((err, doc) => {
        if (err) return
        var filepath = path.join(process.cwd(), configApp.datapath, 'exports', id + '.json')
        jsonfile.writeFileSync(filepath, doc, {
            spaces: 4
        })
    })
}

db.backup = () => {
    return new Promise((resolve, reject) => {
        db.all().exec((err, docs) => {
            if (err) return
            var date = new Date;
            var filename = path.join(process.cwd(), configApp.datapath, app.simulation.id + '_' + date.toJSON() + '.backup')
            var backupDB = new NeDB({
                filename: filename,
                timestampData: true,
                autoload: true,
            })
            backupDB.insert(docs, (err, docs) => {
                console.log('Backup successful: ' + docs.length + ' docs')
                resolve(true)
            })
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
