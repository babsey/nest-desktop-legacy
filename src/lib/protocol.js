"use strict"

const NeDB = require('nedb');
const path = require('path');

var protocol = {};

protocol.all = function() {
    return protocol.db.find({})
}

protocol.addDropdown = function(data) {
    var datetime = app.format.datetime(data.updatedAt)
    $('#protocol-list').append('<li><a href="#" data-id="' + data._id + '" id="' + data._id + '" rel="popover" class="protocol">' + datetime + '</a></li>')
    $('#' + data._id).popover({
        html: true,
        animation: false,
        trigger: 'hover',
        content: app.renderer.simulationProtocol(data)
    });
    $('#' + data._id).on('click', function(e) {
        e.preventDefault()
        app.data = data;
        $('#protocol-label').html(datetime)
        app.simulation.update()
    })
}

protocol.updateDropdown = function(data) {
    $('#' + data._id).remove()
        // protocol.addDropdown(data)
}

protocol.update = function() {
    if (app.config.app().get('simulation.protocol')) {
        app.protocol.all().sort({
            updatedAt: -1
        }).exec(function(err, docs) {
            if (docs.length == 0) return
            $('#protocol-list').empty()
            docs.map(function(doc, idx) {
                // if (idx==0) return
                protocol.addDropdown(doc)
            })
            $('#protocol-label').html(app.format.datetime(docs[0].updatedAt))
            $('#protocol').show()
        })
    } else {
        $('#protocol').hide()
    }
}

protocol.init = function(name) {
    var filename = path.join(app.config.app().get('db.local.path'), 'protocols', app.simulation.id + '.db')
    protocol.db = new NeDB({
        filename: filename,
        timestampData: true,
        autoload: true,
    })
    protocol.update()
}

protocol.add = function(data) {
    if (!app.config.app().get('simulation.protocol')) return
    data.hash = app.hash(data);
    delete data._id;
    delete data.updatedAt;
    protocol.db.findOne({
        hash: data.hash
    }).exec(function(err, doc) {
        if (doc) {
            protocol.db.update({
                hash: data.hash,
            }, data, {}, function() {
                protocol.update()
            })
        } else {
            protocol.db.insert(data, function(err, newDocs) {
                protocol.update()
            })
        }
    })
}

module.exports = protocol
