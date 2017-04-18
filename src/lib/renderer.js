"use strict"

var renderer = {};

const path = require('path');
const fs = require('fs');

renderer.simulationThumbnails = function(doc) {
    var configApp = app.config.app();
    if (fs.existsSync(path.join(process.cwd(), configApp.datapath, 'images', doc._id + '.png'))) {
        var src = path.join(process.cwd(), configApp.datapath, 'images', doc._id + '.png');
    } else {
        var src = path.join(__dirname, '..', 'assets', 'img', 'simulation_default.png');
    }
    var div = [];
    div.push('<div id="' + doc._id + '"class="simulation col-xs-12 col-sm-4 col-md-3" data-doi="' + doc.doi + '">')
    div.push('<div class="thumbnail">')
    div.push('<div style="position:absolute; z-index:10">')
    div.push('<a href="./templates/simulation.html?simulation=' + doc._id + '" ' + 'class="btn btn-default" type="button" title="' + doc.name + '">')
    div.push(app.format.truncate(doc.name))
    div.push('</a></div>')
    div.push('<img src="' + src + '">')
    div.push('<div class="description" style="display: none">' + (doc.description || 'No description found.') + '</div>')
    div.push('</div></div>')
    return div.join('')
}

renderer.simulationDropdown = function(doc) {
    var configApp = app.config.app();
    if (fs.existsSync(path.join(process.cwd(), configApp.datapath, 'images', doc._id + '.png'))) {
        var src = path.join(process.cwd(), configApp.datapath, 'images', doc._id + '.png');
    } else {
        var src = path.join(__dirname, '..', 'assets', 'img', 'simulation_default.png');
    }
    var div = [];
    div.push('<li>')
    div.push('<a href="#" ' + 'id="' + doc._id + '" ' + 'class="simulation"')
    div.push(' rel="popover" ' + 'data-img="' + src + '" ' + 'data-date="' + app.format.date(doc.createdAt) + '"')
    div.push(' title="' + doc.name + '">')
    div.push(app.format.truncate(doc.name))
    div.push('</a></li>')
    return div.join('')
}

renderer.simulationProtocol = function(data) {
    var div = [];
    // div.push(app.format.truncate(data.hash))
    div.push('<img style="width:250px" src="' + $('#' + data._id).data('img') + '" />')
    div.push('<small>')
    data.nodes.map(function(node) {
        div.push('<h4>' + app.format.nodeTitle(node) + '</h4>')
        if (node.n) {
            div.push('<dl>')
            div.push('<dt>npop</dt>')
            div.push('<dd>' + node.n + '</dd>')
            div.push('</dl>')
        }
        div.push('<dl>')
        for (var pkey in node.params) {
            div.push('<dt>' + pkey + '</dt>')
            div.push('<dd>' + node.params[pkey] + '</dd>')
        }
        div.push('</dl>')
    })
    div.push('</small>')
    return div.join('')
}

renderer.simulationPopover = function(d) {
    var div = [];
    div.push('<div>Created at ' + $(d).data('date') + '</div>')
    div.push('<img style="width:250px" src="' + $(d).data('img') + '" />')
    return div.join('')
}

renderer.scrollspy = function(node) {
    var div = [];
    div.push('<li class="node ' + node.element_type + '" data-id="' + node.id + '">')
    var colors = app.chart.colors()
    div.push('<a href="#node_' + node.id + '" ' + 'style="border: 3px solid' + colors[node.id % colors.length] + '; padding: 10px 0px"')
    div.push(' title="' + app.format.nodeTitle(node) + '">')
    div.push(app.format.nodeLabel(node))
    div.push('</a></li>')
    return div.join('')
}

renderer.node = function(node) {
    var div = [];
    div.push('<div id="node_' + node.id + '" data-id="' + node.id + '" class="panel-body node ' + node.element_type + ' node_' + node.id + '">')
    div.push('<hr class="hideOnDrawing">')
    div.push('<div class="content"')
    div.push(' style="')
    var colors = app.chart.colors()
    div.push('border-left: 4px solid ' + colors[node.id % colors.length])
    div.push('" >')
    div.push('<div class="btn-group">')
    div.push('<select data-id="' + node.id + '" class="' + node.element_type + 'Select modelSelect form-control btn btn-default">')
    div.push('<option disabled selected hidden>Select an ' + node.element_type + ' device</option>')
    div.push('</select>')
    div.push('<button class="btn btn-default disableNode">')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon-ok"></span>')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon glyphicon-remove"></span>')
    div.push('</button>')
    div.push('</div>')
    div.push('<div class="nodeSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('<div class="modelSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('</div></div>')
    return div.join('')
}

renderer.connection = function(link) {
    var div = []
    div.push('<div data-id="' + link.id + '" class="panel-body link">')
    div.push('<hr>')
    div.push('<div class="content"')
    div.push('style="')
    var colors = app.chart.colors()
    div.push('border-left: 4px solid ' + colors[link.source % colors.length] + '; ')
    div.push('border-right: 4px solid ' + colors[link.target % colors.length])
    div.push('" >')
    div.push('<div class="btn-group">')
    div.push('<select class="connSelect modelSelect form-control btn btn-default">')
    div.push('<option disabled selected hidden>Select a connection rule</option>')
    div.push('</select>')
    div.push('<button class="btn btn-default disableLink">')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon-ok"></span>')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon glyphicon-remove"></span>')
    div.push('</button>')
    div.push('</div>')
    div.push('<div class="modelSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('</div></div>')
    return div.join('')
}

renderer.synapse = function(link) {
    var div = []
    div.push('<div data-id="' + link.id + '" class="panel-body link">')
    div.push('<hr>')
    div.push('<div class="content"')
    div.push('style="')
    var colors = app.chart.colors()
    div.push('border-left: 4px solid ' + colors[link.source % colors.length] + '; ')
    div.push('border-right: 4px solid ' + colors[link.target % colors.length])
    div.push('" >')
    div.push('<select class="synSelect modelSelect form-control">')
    div.push('<option disabled selected hidden>Select a synapse model</option>')
    div.push('</select>')
    div.push('<select class="recSelect modelSelect form-control" style="display:none">')
    div.push('<option disabled selected hidden>Select a receptor</option>')
    div.push('</select>')
    div.push('<div class="modelSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('</div></div>')
    return div.join('')
}

module.exports = renderer;
