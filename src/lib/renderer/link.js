"use strict"

var linkRenderer = {
    controller: {}
};

linkRenderer.table = (link) => {
    var configApp = app.config.app();
    var level = configApp.controller.level;

    var div = [];
    if (link.disabled) return
    div.push('<tr class="hline link">')
    div.push('<td>source</td>')
    div.push('<td>' + link.source + '</td>')
    div.push('</tr>')
    div.push('<tr class="link">')
    div.push('<td>target</td>')
    div.push('<td>' + link.target + '</td>')
    div.push('</tr>')
    if (level >= 3) {
        div.push('<tr class="link">')
        div.push('<td>connection rule</td>')
        div.push('<td>' + (link.conn_spec ? link.conn_spec.rule || 'all_to_all' : 'all_to_all') + '</td>')
        div.push('</tr>')
        if (link.conn_spec) {
            Object.keys(link.conn_spec).map((ckey) => {
                if (ckey == 'rule') return
                div.push('<tr class="link">')
                div.push('<td>' + ckey + '</td>')
                div.push('<td>' + link.conn_spec[ckey] + '</td>')
                div.push('</tr>')
            })
        }
        div.push('<tr class="link">')
        div.push('<td>synapse model</td>')
        div.push('<td>' + (link.syn_spec ? link.syn_spec.model || 'static_synapse' : 'static_synapse') + '</td>')
        div.push('</tr>')
    }
    if (level >= 2) {
        if (link.syn_spec) {
            Object.keys(link.syn_spec).map((skey) => {
                if (skey == 'model') return
                div.push('<tr class="link">')
                div.push('<td>' + skey + '</td>')
                div.push('<td>' + link.syn_spec[skey] + '</td>')
                div.push('</tr>')
            })
        }
    }
    return div.join('')
}

linkRenderer.list = (link) => {
    var div = []
    div.push('<h4>' + link.source + ' &#8594; ' + link.target + '</h4>')
    div.push('<dl>')
    for (var ckey in link.conn_spec) {
        div.push('<dt>' + ckey + '</dt>')
        div.push('<dd>' + link.conn_spec[ckey] + '</dd>')
    }
    for (var skey in link.syn_spec) {
        div.push('<dt>' + skey + '</dt>')
        div.push('<dd>' + link.syn_spec[skey] + '</dd>')
    }
    div.push('</dl>')
    return div.join('')
}

linkRenderer.controller.connection = (link) => {
    var ruleSelect = '<div class="dropdown btn-group select connSelect modelSelect">' +
        '<button class="btn btn-default dropdown-toggle disableOnSimulate disableOnRunning" type="button" data-toggle="dropdown">' +
        '<span class="name">Select a connection rule</span> ' +
        '</button>' +
        '<ul class="dropdown-menu"></ul>' +
        '</div>';

    var deleteButton = '<div class="btn-group showOnDrawing">' +
        '<button class="btn btn-default deleteLink">' +
        '<i class="fa fa-trash-o"></i>' +
        '</button>' +
        '</div>';

    var linkConfig = '<div class="linkConfig dropdown btn-group hideOnDrawing">' +
        '<button type="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fa fa-check enabled"></i>' +
        '<i class="fa fa-ban disabled"></i>' +
        '</button>' +
        '<ul class="dropdown-menu dropdown-menu-right">' +
        '<li><a class="resetParameters" href="#"><i class="fa fa-edit"></i> Reset all parameters</a></li>' +
        '<li><a class="disableLink disabled" href="#"><i class="fa fa-heartbeat"></i> Enable this link</a></li>' +
        '<li><a class="disableLink enabled" href="#"><i class="fa fa-ban"></i> Disable this link</a></li>' +
        '<li role="separator" class="divider"></li>' +
        '<li><a class="deleteLink" href="#"><i class="fa fa-trash-o"></i> Delete this link</a></li>' +
        '</ul>' +
        '</div>';

    var connSlider = '<div class="hideOnDrawing">' +
        '<div class="modelSlider hideOnDrawing" style="display:hidden"></div>' +
        '</div>';

    var colors = app.graph.colors();
    var content = '<div class="content" ' + 'style="' +
        'border-left: 4px solid ' + colors[link.source % colors.length] + '; ' +
        'border-right: 4px solid ' + colors[link.target % colors.length] + '">' +
        '<label style="padding-left: 15px;">Rule</label>' +
        '<div class="btn-group">' +
        ruleSelect +
        deleteButton +
        linkConfig +
        '</div>' +
        connSlider +
        '</div>';

    var html = '<div class="panel-body link" data-id="' + link.id +
        '" data-source="' + link.source + '" data-target="' + link.target + '">' +
        content + '</div>';

    return html
}

linkRenderer.controller.synapse = (link) => {
    var modelSelect = '<div class="dropdown btn-group select synSelect modelSelect">' +
        '<button class="btn btn-default dropdown-toggle disableOnSimulate disableOnRunning" type="button" data-toggle="dropdown">' +
        '<span class="name">Select a synapse model</span> ' +
        '</button>' +
        '<ul class="dropdown-menu"></ul>' +
        '</div>';

    var recSelect = '<div class="dropdown btn-group select recSelect modelSelect" style="display:none">' +
        '<button class="btn btn-default dropdown-toggle disableOnSimulate disableOnRunning" type="button" data-toggle="dropdown">' +
        '<span class="name">Select a receptor model</span> ' +
        '</button>' +
        '<ul class="dropdown-menu selectMenu"></ul>' +
        '</div>';

    var deleteButton = '<div class="btn-group showOnDrawing">' +
        '<button class="btn btn-default deleteLink">' +
        '<i class="fa fa-trash-o"></i>' +
        '</button>' +
        '</div>';

    var linkConfig = '<div class="linkConfig dropdown btn-group hideOnDrawing">' +
        '<button type="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fa fa-check enabled"></i>' +
        '<i class="fa fa-ban disabled"></i>' +
        '</button>' +
        '<ul class="dropdown-menu dropdown-menu-right">' +
        '<li><a class="resetParameters" href="#"><i class="fa fa-edit"></i> Reset all parameters</a></li>' +
        '<li><a class="disableLink disabled" href="#"><i class="fa fa-heartbeat"></i> Enable this link</a></li>' +
        '<li><a class="disableLink enabled" href="#"><i class="fa fa-ban"></i> Disable this link</a></li>' +
        '<li role="separator" class="divider"></li>' +
        '<li><a class="deleteLink" href="#"><i class="fa fa-trash-o"></i> Delete this link</a></li>' +
        '</ul>' +
        '</div>';

    var synSlider = '<div class="hideOnDrawing">' +
        '<div class="modelSlider hideOnDrawing" style="display:hidden"></div>' +
        '</div>';

    var colors = app.graph.colors();
    var content = '<div class="content" ' + 'style="' +
        'border-left: 4px solid ' + colors[link.source % colors.length] + '; ' +
        'border-right: 4px solid ' + colors[link.target % colors.length] + '">' +
        '<label style="padding-left: 15px;">Model</label>' +
        '<div class="btn-group">' +
        modelSelect +
        deleteButton +
        linkConfig +
        '</div>' +
        '<label class="recLabel" style="padding-left: 15px; display:none">Receptor</label>' +
        '<div class="btn-group">' +
        recSelect +
        '</div>' +
        synSlider +
        '</div>';

    var html = '<div class="panel-body link" data-id="' + link.id +
        '" data-source="' + link.source + '" data-target="' + link.target + '">' +
        content + '</div>';

    return html
}

module.exports = linkRenderer;
