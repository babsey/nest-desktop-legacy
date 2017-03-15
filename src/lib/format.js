"use strict"

var format = {};

format.truncate = function(ids) {
    if (!ids) return ''
    if (ids.length > 2) return [ids[0], ids[ids.length - 1]].join('-')
    return ids.join(',')
}

format.replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

format.nodeLabel = function(node) {
    if (node.label) { return node.label }
    return (node.model == 'parrot_neuron' ? 'P' : node.type.charAt(0).toUpperCase())
}

format.nodeTitle = function(node) {
    if (node.title) { return node.title }
    var title = node.model || node.type
    return app.format.replaceAll(title, '_', ' ').charAt(0).toUpperCase() + title.slice(1)
}

format.truncate = function(str, n) {
    var n = n || 25
    if (str.length < n) return str
    return str.slice(0, n) + '...';
}

format.date = function(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var date = new Date(date);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex].slice(0, 3) + ' ' + year;
}

format.datetime = function(date) {
    return new Date(date).toLocaleString()
}

format.time = function(date) {
    return new Date(date).toLocaleTimeString()
}

format.fillArray = function(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}

format.changes = function(changes) {
    var arr = [];
    changes.nodes.map(function(node) {
        for (var pkey in node) {
            arr.push(pkey + ':'+ node[pkey])
        }
    })
    changes.links.map(function(link) {
        for (var pkey in link) {
            arr.push(pkey + ':'+ link[pkey])
        }
    })
    return arr.join(',')
}

module.exports = format;
