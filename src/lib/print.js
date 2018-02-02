"use strict"

const fs = require('fs');
const path = require('path');

var print = {};

var cssPagedMedia = (function() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    return function(rule) {
        style.innerHTML = rule;
    };
}());

cssPagedMedia.size = function(size) {
    cssPagedMedia('@page {size: ' + size + '}');
};

print.ToPDF = (name, path) => {
    if (!ame.endsWith('.pdf')) {
        name = name + '.pdf'
    }
    
    var configElectron = require(path.join(process.cwd(), 'config', 'electron.json'));

    let {
        width,
        height,
    } = configElectron.windowBounds;

    var pageWidth = width - 319 + 240 + 50;
    var pageHeight = pageWidth * Math.sqrt(2);

    $('#description').css('margin-top', (height - 30) + 'px')
    $('#description h4').css('font-size', '1.7vw')
    $('.description').css('font-size', '1.3vw')

    cssPagedMedia.size(pageWidth + 'px ' + pageHeight + 'px');
    require('electron').remote.require('./main').printToPDF(path.join(path, name))
    setTimeout(() => {
        app.message.show('Info', 'PDF successfully saved.')
    }, 200)
}

module.exports = print;
