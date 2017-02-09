"use strict"

const PouchDB = require('pouchdb');
const auth = require('../store/auth');
const q = require('../store/query');
var config = require('../config').global();

function login(name, password, reset_db) {
    config.set('user', {
        name: name,
        password: password
    })
    auth.update_db_name()

    if (reset_db) {
        var localDB = new PouchDB(config.get('db_name'), {
            adapter: 'idb'
        });
        localDB.destroy()
        setTimeout(q.init,100)
    }
}

function logout(reset_db) {
    config.set('user', {
        name: '',
        password: ''
    })

    if (reset_db) {
        var localDB = new PouchDB(config.get('db_name'), {
            adapter: 'idb'
        });
        localDB.destroy()
        setTimeout(q.init,100)
    }
}

module.exports = {
    logout: logout,
    login: login
}
