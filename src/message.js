"use strict"

const $ = require('jquery')
const uuidV4 = require('uuid/v4');

function message(mode, content) {
    var messageID = uuidV4();
    $('#message').append('<div id="'+ messageID + '" class="' + mode + '"><strong>' + mode + '!</strong> ' + content + '</div>')
    setTimeout(function() {
        $('#'+ messageID).fadeOut('slow', function() {
            $('#'+ messageID).remove()
        })
    }, 2000)
}

module.exports = message
