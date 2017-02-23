"use strict"

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-authentication'));
var config = require('../config').app();

let {
    host,
    port,
    db_name
} = config.get('remoteDB');

let {
    name,
    password
} = config.get('user');

var remoteDB = new PouchDB('http://' + host + ':' + port + '/_users', {
    skip_setup: true
});

function signUp() {
    remoteDB.signUp(name, password, {
        metadata: {
            db_name: db_name
        }
    })
}

module.exports = {
    signUp: signUp,
}
