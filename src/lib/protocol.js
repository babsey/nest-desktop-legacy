"use strict"

const NeDB = require('nedb');
const path = require('path');
const fs = require('fs');

var protocol = {};

protocol.all = function() {
    return protocol.db.find({})
}

protocol.addDropdown = function(data) {
    var filepath = '../../data/images/' + data._id + '.png';
    if (fs.existsSync(__dirname + path.sep + filepath)) {
        var src = filepath
    } else {
        var src = '../assets/img/simulation_default.png'
    }
    var datetime = app.format.datetime(data.updatedAt)
    $('#protocol-list').append('<li><a href="#" data-id="' + data._id + '" id="' + data._id + '" data-img="' + src + '" rel="popover" class="protocol">' + datetime + '</a></li>')
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
    var view = app.config.app().get('simulation.protocol') || false
    app.protocol.all().sort({
        updatedAt: -1
    }).exec(function(err, docs) {
        if (docs.length == 0) return
        $('#protocol-list').empty()
            // $('#protocol-list .protocol').popover('dispose')
        docs.map(function(doc, idx) {
            // if (idx==0) return
            protocol.addDropdown(doc)
        })
        $('#protocol-label').html(app.format.datetime(docs[0].updatedAt))
    })
    // $('#get-protocol-list').toggleClass('disabled', !view)
    $('#view-protocol').find('.glyphicon-remove').toggle(!view)
    $('#view-protocol').find('.fa-history').toggle(view)

    $('#view-protocol').on('click', function() {
        app.config.app().set('simulation.protocol', !view)
        protocol.update()
    })
}

protocol.init = function() {
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
