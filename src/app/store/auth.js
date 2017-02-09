"use strict"

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-authentication'));
var config = require('../config').global();

let {
    host,
    port
} = config.get('remoteDB');

var name = 'admin',
    password = 'minda';

var remoteDB = new PouchDB('http://' + name + ':' + password + '@' + host + ':' + port + '/_users', {
    skip_setup: true
});

function update_db_name() {
    remoteDB.getUser(config.store.user.name).then(function(response) {
        var db_name = response.db_name
        config.set('remoteDB', {
            host: host,
            port: port,
            db_name: db_name
        })
    })
}

module.exports = {
    update_db_name: update_db_name
}
