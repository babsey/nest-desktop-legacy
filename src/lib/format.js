"use strict"

var format = {};

format.number = (value, l) => {
    l = (l == undefined) ? 2 : l;
    var fmt = d3.format('.' + l + 'f')
    return fmt(value)
}

format.replaceAll = (str, find, replace) => str.replace(new RegExp(find, 'g'), replace);

format.nodeLabel = (node) => {
    if (node.label) {
        return node.label
    }
    return (node.model == 'parrot_neuron' ? 'P' : node.element_type.charAt(0).toUpperCase())
}

format.nodeTitle = (node) => {
    if (node.title) {
        return node.title
    }
    var title = node.model || node.element_type
    return app.format.replaceAll(title, '_', ' ').charAt(0).toUpperCase() + title.slice(1)
}

format.capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

format.axisLabel = (label, unit) => {
    var label = label || '';
    var unit = unit ? ' (' + unit + ')' : '';
    var text = label + unit;
    return text
}

format.truncateList = (lst, n) => {
    var n = n || 25
    if (lst.length < n) return lst
    return lst.slice(0, n/2).join(',') + '...' + lst.slice(lst.length-n/2, lst.length).join(',');
}

format.truncateStr = (str, n) => {
    var n = n || 25
    if (str.length < n) return str
    return str.slice(0, n) + '...';
}

format.date = (date) => {
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

format.datetime = (date) => new Date(date).toLocaleString();
format.time = (date) => new Date(date).toLocaleTimeString();

format.fillArray = (value, len) => {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}

format.changes = (changes) => {
    var arr = [];
    changes.nodes.map((node) => {
        for (var pkey in node) {
            arr.push(pkey + ':' + node[pkey])
        }
    })
    changes.links.map((link) => {
        for (var pkey in link) {
            arr.push(pkey + ':' + link[pkey])
        }
    })
    return arr.join(',')
}

format.syntaxHighlight = (json) => {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
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
