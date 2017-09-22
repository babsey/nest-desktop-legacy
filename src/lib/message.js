"use strict"

const uuidV4 = require('uuid/v4');

var message = {};

message.show = function(mode, content, duration) {
    var messageId = uuidV4();
    $('#message .content').append('<div id="' + messageId + '" class="' + mode + '"><strong>' + mode + '</strong> ' + content + '</div>')

    if (duration) {
        var timeoutId = setTimeout(function() {
            $('#' + messageId).fadeOut('slow')
        }, duration)
        $('#' + messageId).data('timeoutId', timeoutId)
    }
    $('#' + messageId).on('mouseover', function() {
        message.hide(messageId)
    })
    return messageId
}

message.log = function(text) {
    if (app.DEBUG) {
        console.log(text)
    }
}

message.hide = function(messageId) {
    return $('#' + messageId).hide()
}

module.exports = message
