"use strict"

const uuidV4 = require('uuid/v4');

var message = {};

message.show = (mode, content, duration) => {
    var messageId = uuidV4();
    $('#message .content').append('<div id="' + messageId + '" class="' + mode + '"><strong>' + mode + '</strong> ' + content + '</div>')

    if (duration) {
        var timeoutId = setTimeout(() => {
            $('#' + messageId).fadeOut('slow')
        }, duration)
        $('#' + messageId).data('timeoutId', timeoutId)
    }
    $('#' + messageId).on('mouseover', () => {
        message.hide(messageId)
    })
    return messageId
}

message.log = (text) => {
    if (!(app.config.app().log)) return
    if ($('#message .content').find('div').length > 30) {
        $('#message .content').find('div:first-child').remove()
    }

    var date = new Date;
    message.show(date.toLocaleTimeString(), text)
}

message.hide = (messageId) => $('#' + messageId).hide();
message.clear = (messageId) => $('#message .content div').hide();

module.exports = message
