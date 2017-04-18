"use strict"

const NeDB = require('nedb');
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile')

var protocol = {};

protocol.all = function() {
    return protocol.db.find({})
}

protocol.addDropdown = function(data) {
    var configApp = app.config.app();
    if (fs.existsSync(path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png'))) {
        var src = path.join(process.cwd(), configApp.datapath, 'images', data._id + '.png');
    } else {
        var src = path.join(__dirname, '..', 'assets', 'img', 'simulation_default.png');
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
    var view = app.config.app().simulation.protocol || false
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
        var configApp = app.config.app();
        configApp.simulation.protocol = !view
        app.config.save('app', configApp)
        protocol.update()
    })
}

protocol.init = function() {
    var configApp = app.config.app()
    var filename = path.join(process.cwd(), configApp.datapath, 'protocols', app.simulation.id + '.db')
    protocol.db = new NeDB({
        filename: filename,
        timestampData: true,
        autoload: true,
    })
    protocol.update()
}

protocol.add = function(data) {
    if (!app.config.app().simulation.protocol) return
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
                setTimeout(function() {
                    app.screen.capture(newDocs, false)
                    setTimeout(function() {
                        protocol.update()
                    }, 500)
                }, 500)
            })
        }
    })
}

module.exports = protocol
