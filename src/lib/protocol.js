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
    $('#' + data._id).off('click').on('click', function(e) {
        e.preventDefault()
        app.data = data;
        $('#protocol-label').html(datetime)
        app.simulation.update()
    })
}

protocol.removeDropdown = function(data) {
    $('#' + data._id).remove()
    // protocol.addDropdown(data)
}

protocol.add = function(data) {
    var configApp = app.config.app()
    var data = $.extend({}, data)
    data.user = configApp.user.name;
    data.version = configApp.version;
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
                new Promise((resolve, reject) => {
                    app.screen.capture(doc, true)
                    resolve('captured')
                }).then((onResolved) => {
                    protocol.update()
                })
            })
        } else {
            protocol.db.insert(data, (err, newDocs) => {
                app.data._id = newDocs._id
                if (app.simulation.id == app.data._id) {
                    $('#raw-data').find('a').attr('href', './raw_data.html?simulation=' + app.simulation.id)
                } else {
                    $('#raw-data').find('a').attr('href', './raw_data.html?simulation=' + app.simulation.id + '&protocol=' + app.data._id)
                }
                new Promise((resolve, reject) => {
                    app.screen.capture(newDocs, true)
                    resolve('captured')
                }).then((onResolved) => {
                    protocol.update()
                })
            })
        }
    })
}

protocol.get = function(id) {
    return protocol.db.findOne({
        _id: id
    })
}

protocol.update = function() {
    $('#protocol').toggleClass('btn-primary', app.simulation.protocol || false)
    app.protocol.all().sort({
        updatedAt: -1
    }).exec(function(err, docs) {
        if (docs.length == 0) return
        $('#protocol-list').empty()
        docs.map(function(doc, idx) {
            protocol.addDropdown(doc)
        })
        $('#protocol-label').html(app.format.datetime(docs[0].updatedAt))
    })
}

protocol.events = function() {
    var DELAY = 700,
        clicks = 0,
        timer = null;
    $('#protocol').on('click', function() {
        if (app.chart.networkLayout.drawing) return
        if (app.simulation.protocol) {
            app.simulation.protocol = !(app.simulation.protocol || false)
            protocol.update()
            return
        }
        clicks++; //count clicks
        if (clicks === 1) {
            timer = setTimeout(function() {
                protocol.add(app.data)
                clicks = 0; //after action performed, reset counter
            }, DELAY);
        } else {
            clearTimeout(timer); //prevent single-click action
            app.simulation.protocol = !(app.simulation.protocol || false)
            clicks = 0; //after action performed, reset counter
        }
        protocol.update()
    })
    $('#view-protocol').on('click', function() {
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

module.exports = protocol
