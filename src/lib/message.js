"use strict"

require('bootstrap-notify');

var message = {};

message.notify = $.notify;
message.notifyClose = $.notifyClose;

message.show = (title, content, delay) => message.notify({
    // options
    icon: 'fa fa-ellipsis-v',
    title: title,
    message: content
}, {
    // settings
    type: 'minimalist',
    allow_dismiss: false,
    placement: {
        from: "top",
        align: "left"
    },
    delay: (delay != undefined ? delay : 5000),
    offset: {
        y: 50,
        x: 5,
    },
    spacing: 0
})

message.log = (text) => {
    if (!(app.config.app().log)) return
    var date = new Date().toLocaleTimeString();
    message.show(date, text, 2000)
}

message.simulate = () => message.notify({
    // options
    icon: 'fa fa-hourglass-start',
    title: 'Please wait.',
    message: 'Simulation is running.'
}, {
    // settings
    type: 'info',
    placement: {
        from: "top",
        align: "center"
    },
    delay: 0,
    template: '<div data-notify="container" class="col-xs-11 col-sm-2 alert alert-{0}" role="alert">' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '</div>'
})

message.resume = () => message.notify({
    // options
    icon: 'fa fa-pause',
    title: '  ',
    message: 'Click me to pause simulation.'
}, {
    // settings
    type: 'default',
    placement: {
        from: "top",
        align: "center"
    },
    offset: 0,
    delay: 0,
    template: '<div data-notify="container" class="col-xs-11 col-sm-2 alert alert-{0}" role="alert" id="message-resume" style="background-color:white">' +
        '<button aria-hidden="true" class="btn btn-danger" type="button" onclick="app.simulation.resume.pause()">' +
        '<span data-notify="icon"></span>' +
        '<span data-notify="title">{1}</span>' +
        '<span data-notify="message">{2}</span>' +
        '</button>' +
        '<div class="content" style="margin-top:10px"></div>' +
        '</div>',
    onShow: () => app.simulation.resume.slider()
})

module.exports = message
