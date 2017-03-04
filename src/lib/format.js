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

format.fillArray = function(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}

module.exports = format;
