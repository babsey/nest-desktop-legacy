"use strict"

var format = {};

format.number = function(value, l) {
    var fmt = d3.format('.' + (l || 2) + 'f')
    return fmt(value)
}

format.truncate = function(ids) {
    if (!ids) return ''
    if (ids.length > 2) return [ids[0], ids[ids.length - 1]].join('-')
    return ids.join(',')
}

format.replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

format.nodeLabel = function(node) {
    if (node.label) {
        return node.label
    }
    return (node.model == 'parrot_neuron' ? 'P' : node.element_type.charAt(0).toUpperCase())
}

format.nodeTitle = function(node) {
    if (node.title) {
        return node.title
    }
    var title = node.model || node.element_type
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
            arr.push(pkey + ':' + node[pkey])
        }
    })
    changes.links.map(function(link) {
        for (var pkey in link) {
            arr.push(pkey + ':' + link[pkey])
        }
    })
    return arr.join(',')
}

format.syntaxHighlight = function(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

module.exports = format;
