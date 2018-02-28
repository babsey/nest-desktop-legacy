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
    var div = []
    div.push('<div data-id="' + link.id + '" data-source="' + link.source + '" data-target="' + link.target + '" class="panel-body link">')
    div.push('<div class="content"')
    div.push('style="')
    var colors = app.graph.colors()
    div.push('border-left: 4px solid ' + colors[link.source % colors.length] + '; ')
    div.push('border-right: 4px solid ' + colors[link.target % colors.length])
    div.push('" >')
    div.push('<label style="padding-left:15px;min-width: 200px;">Rule</label>')
    div.push('<div class="btn-group">')
    div.push('<select class="connSelect modelSelect form-control btn btn-default disableOnRunning">')
    div.push('<option disabled selected hidden>Select a connection rule</option>')
    div.push('</select>')
    div.push('<button class="btn btn-default disableLink disableOnRunning">')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon-ok"></span>')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon glyphicon-remove"></span>')
    div.push('</button>')
    div.push('</div>')
    div.push('<div class="modelSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('</div></div>')
    // div.push('<hr>')
    return div.join('')
}

linkRenderer.controller.synapse = (link) => {
    var div = []
    div.push('<div data-id="' + link.id + '" data-source="' + link.source + '" data-target="' + link.target + '" class="panel-body link">')
    div.push('<div class="content"')
    div.push('style="')
    var colors = app.graph.colors()
    div.push('border-left: 4px solid ' + colors[link.source % colors.length] + '; ')
    div.push('border-right: 4px solid ' + colors[link.target % colors.length])
    div.push('" >')
    div.push('<label style="padding-left:15px;min-width: 200px;">Model</label>')
    div.push('<div>')
    div.push('<select class="synSelect modelSelect form-control disableOnRunning">')
    div.push('<option disabled selected hidden>Select a synapse model</option>')
    div.push('</select>')
    div.push('<select class="recSelect modelSelect form-control" style="display:none">')
    div.push('<option disabled selected hidden>Select a receptor</option>')
    div.push('</select>')
    div.push('</div>')
    div.push('<div class="modelSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('</div></div>')
    // div.push('<hr>')
    return div.join('')
}

module.exports = linkRenderer;
