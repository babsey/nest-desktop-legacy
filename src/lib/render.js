"use strict"

var render = {};

const path = require('path');
const fs = require('fs');

render.simulationThumbnails = function(doc) {
    var filepath = '../data/images/' + doc._id + '.png';
    if (fs.existsSync(__dirname + path.sep + '..' + path.sep + filepath)) {
        var src = filepath;
    } else {
        var src = './assets/img/simulation_default.png';
    }
    var div = [];
    div.push('<div id="' + doc._id + '"class="simulation col-xs-12 col-sm-4 col-md-3">')
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

render.simulationDropdown = function(doc) {
    var filepath = '../../data/images/' + doc._id + '.png';
    if (fs.existsSync(__dirname + path.sep + filepath)) {
        var src = filepath
    } else {
        var src = '../assets/img/simulation_default.png'
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

render.scrollspy = function(node) {
    var div = [];
    div.push('<li class="node ' + node.type + ' node_' + node.id + '" nidx="' + node.id + '">')
    div.push('<a href="#node_' + node.id + '" ' + 'style="border: 3px solid ' + app.simChart.colors[node.id % app.simChart.colors.length] + '"')
    div.push(' title="' + app.format.replaceAll(node.model, '_', ' ') + '">')
    div.push((node.model == 'parrot_neuron' ? 'P' : node.type.charAt(0).toUpperCase()))
    div.push('</a></li>')
    return div.join('')
}

render.node = function(node) {
    var div = [];
    div.push('<div id="node_' + node.id + '" class="panel-body node ' + node.type + '" nidx="' + node.id + '">')
    div.push('<hr>')
    div.push('<div class="content"')
    div.push(' style="')
    var colors = app.simChart.colors
    div.push('border-left: 4px solid ' + colors[node.id % colors.length])
    div.push('" >')
    div.push('<select id="select_' + node.id + '" class="' + node.type + 'Select modelSelect form-control">')
    div.push('<option disabled selected hidden>Select an ' + node.type + ' device</option>')
    div.push('</select>')
    div.push('<div class="nodeSlider"></div>')
    div.push('<div class="modelSlider"></div>')
    div.push('</div></div>')
    return div.join('')
}

render.connection = function(link) {
    var div = []
    div.push('<div id="conn_' + link.id + '" class="panel-body link synapse" lidx="' + link.id + '">')
    div.push('<hr>')
    div.push('<div class="content"')
    div.push('style="')
    var colors = app.simChart.colors
    div.push('border-left: 4px solid ' + colors[link.source % colors.length] +'; ')
    div.push('border-right: 4px solid ' + colors[link.target % colors.length])
    div.push('" >')
    div.push('<select class="connSelect modelSelect form-control">')
    div.push('<option disabled selected hidden>Select a connection rule</option>')
    div.push('</select>')
    div.push('<div class="connSlider"></div>')
    div.push('</div></div>')
    return div.join('')
}

render.synapse = function(link) {
    var div = []
    div.push('<div id="syn_' + link.id + '" class="panel-body link synapse" lidx="' + link.id + '">')
    div.push('<hr>')
    div.push('<div class="content"')
    div.push('style="')
    var colors = app.simChart.colors
    div.push('border-left: 4px solid ' + colors[link.source % colors.length] +'; ')
    div.push('border-right: 4px solid ' + colors[link.target % colors.length])
    div.push('" >')
    div.push('<select class="synSelect modelSelect form-control">')
    div.push('<option disabled selected hidden>Select a synapse model</option>')
    div.push('</select>')
    div.push('<div class="synSlider"></div>')
    div.push('</div></div>')
    return div.join('')
}

module.exports = render;
