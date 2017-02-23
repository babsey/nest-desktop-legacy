"use strict"

var format = {};

format.replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
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

  return day + ' ' + monthNames[monthIndex].slice(0,3) + ' ' + year;
}

module.exports = format;
