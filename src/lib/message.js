"use strict"

const uuidV4 = require('uuid/v4');

var message = {};

message.show = function(mode, content, duration) {
    var messageID = uuidV4();
    $('#message').append('<div id="' + messageID + '" class="' + mode + '"><strong>' + mode + '!</strong> ' + content + '</div>')

    if (duration) {
        setTimeout(function() {
            $('#' + messageID).fadeOut('slow', function() {
                $('#' + messageID).remove()
            })
        }, duration)
    }
    return messageID
}

message.hide = function(messageID) {
    $('#' + messageID).remove()
}

module.exports = message
