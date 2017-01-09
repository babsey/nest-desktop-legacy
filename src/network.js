"use strict"

var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'network.nedb',
        autoload: true
    });

function get(id) {
    return db.findOne({
        _id: id
    })
}

function add(data) {
    data.data.nodes.forEach(function (node) {
        if ('events' in node) {
            node.events = {}
        }
    })
    db.insert(data)
}

function filter(nest_app) {
    return db.find({
        nest_app: nest_app,
    })
}

module.exports = {
    get: get,
    add: add,
    filter: filter,
}
