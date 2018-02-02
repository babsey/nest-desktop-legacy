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

print.toPDF = (filename, filepath) => {
    if (!filename.endsWith('.pdf')) {
        filename = filename + '.pdf'
    }
    var viewDescription = $('#pdf-description').prop('checked');
    var configElectron = require(path.join(process.cwd(), 'config', 'electron.json'));

    let {
        width,
        height,
    } = configElectron.windowBounds;

    var pageWidth = width - 319 + 240 + 50;
    var pageHeight = viewDescription ? pageWidth * Math.sqrt(2) : height + 50;

    var dataDialog = $('#data-dialog').hasClass('in');
    if (dataDialog) {
        $('#data-dialog').removeClass('fade')
        $('#data-dialog').modal('hide')
    }

    $('#description').toggle(viewDescription)
    $('#description').css('margin-top', (height - 30) + 'px')
    $('#description h4').css('font-size', '1.7vw')
    $('#description .description').css('font-size', '1.3vw')

    cssPagedMedia.size(pageWidth + 'px ' + pageHeight + 'px');
    require('electron').remote.require('./main').printToPDF(path.join(filepath, filename))
    setTimeout(() => {
        app.message.show('Info', 'PDF successfully saved.')
        if (dataDialog) {
            $('#data-dialog').modal('show')
            $('#data-dialog').addClass('fade')
        }
    }, 200)

}

module.exports = print;
