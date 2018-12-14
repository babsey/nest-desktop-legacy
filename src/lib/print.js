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

print.toPDF = (filename, filepath) => {
    if (!filename.endsWith('.pdf')) {
        filename = filename + '.pdf'
    }
    var viewDescription = $('#pdf-description').prop('checked');
    var configElectron = require(path.join(app.dataPath, 'config', 'electron.json'));

    let {
        width,
        height,
    } = configElectron.windowBounds;

    $('#description').parents('.visible-print').attr('style', 'display:block!important')
    var offsetHeight = $('#description')[0].offsetHeight;
    $('#description').parents('.visible-print').attr('style', '')

    // var pageWidth = width - 319 + 240 + 50;
    var pageWidth = width + 50;
    var pageHeight = 90 + (viewDescription ? height + offsetHeight : height);

    var dataDialog = $('#data-dialog').hasClass('in');
    if (dataDialog) {
        $('#data-dialog').removeClass('fade')
        $('#data-dialog').modal('hide')
    }

    $('#description').toggle(viewDescription)
    $('#description').css('margin-top', (height - 30) + 'px')

    cssPagedMedia('@page {size: ' + pageWidth + 'px ' + pageHeight + 'px' + '}');
    require('electron').remote.require('./main').printToPDF(path.join(filepath, filename))
    setTimeout(() => {
        app.message.show('Info', 'PDF successfully saved.')
        $('#description').attr('style', '')
        if (dataDialog) {
            $('#data-dialog').modal('show')
            $('#data-dialog').addClass('fade')
        }
    }, 200)

}

print.events = () => {
    $('.printToPDF').on('click', (e) => {
        var configApp = app.config.app();
        var filename = app.data._id + '.pdf';
        var filepath = path.join(app.dataPath, 'exports');
        $('#pdf-form #pdf-filename').val(filename).focus();
        $('#pdf-form #pdf-filepath').val(filepath);
        $('#pdf-description').prop('checked', app.data.description != undefined)
        $('#pdf-description').prop('disabled', app.data.description == undefined)
    })
    $('#pdf-submit').on('click', function(e) {
        var filename = $('#pdf-form #pdf-filename').val();
        var filepath = $('#pdf-form #pdf-filepath').val();
        print.toPDF(filename, filepath);
    })
}

module.exports = print;
