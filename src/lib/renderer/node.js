"use strict"

var nodeRenderer = {};

nodeRenderer.table = (node) => {
    var configApp = app.config.app();
    var level = configApp.simulation.level;
    var nodes = app.config.nest(node.element_type);
    var models = nodes.map((d) => d.id);
    var nidx = models.indexOf(node.model);
    var params = nodes[nidx].sliderDefaults.map((d) => d.id);
    var colors = app.graph.colors();

    var div = [];
    div.push('<tr class="hline node" ')
    div.push('style="border-left: 4px solid ' + colors[node.id % colors.length] + '">')
    div.push('<td>ID</td>')
    div.push('<td>' + node.id + '</td>')
    div.push('</tr>')
    div.push('<tr class="node" ')
    div.push('style="border-left: 4px solid ' + colors[node.id % colors.length] + '">')
    div.push('<td>model</td>')
    div.push('<td>' + node.model + '</td>')
    div.push('</tr>')
    if (node.n) {
        div.push('<tr class="node" ')
        div.push('style="border-left: 4px solid ' + colors[node.id % colors.length] + '">')
        div.push('<td>n</td>')
        div.push('<td>' + node.n + '</td>')
        div.push('</tr>')
    }
    for (var pkey in node.params) {
        if (pkey == 'record_from') continue
        var pidx = params.indexOf(pkey);
        if (pidx != -1) {
            if (level < nodes[nidx].sliderDefaults[pidx].level) continue;
        }
        div.push('<tr class="node" ')
        div.push('style="border-left: 4px solid ' + colors[node.id % colors.length] + '" ')
        div.push('level="' + level + '">')
        div.push('<td>' + pkey + '</td>')
        div.push('<td>' + node.params[pkey] + '</td>')
        div.push('</tr>')
    }
    return div.join('')
}

nodeRenderer.list = (node) => {
    var div = []
    div.push('<h4>' + node.id + ' ' + app.format.nodeTitle(node) + '</h4>')
    if (node.n) {
        div.push('<dl>')
        div.push('<dt>npop</dt>')
        div.push('<dd>' + node.n + '</dd>')
        div.push('</dl>')
    }
    div.push('<dl>')
    for (var pkey in node.params) {
        div.push('<dt>' + pkey + '</dt>')
        div.push('<dd>' + node.params[pkey] + '</dd>')
    }
    div.push('</dl>')
    return div.join('')
}

nodeRenderer.spy = (node) => {
    var div = [];
    div.push('<li class="node ' + node.element_type + '" data-id="' + node.id + '">')
    var colors = app.graph.colors()
    div.push('<a href="#node_' + node.id + '" ' + 'style="border-color: ' + colors[node.id % colors.length] + '; padding: 10px 0px"')
    div.push(' title="' + app.format.nodeTitle(node) + '">')
    // div.push(app.format.nodeLabel(node))
    div.push(node.id)
    div.push('</a></li>')
    return div.join('')
}

nodeRenderer.controller = (node) => {
    var div = [];
    var colors = app.graph.colors();
    div.push('<div id="node_' + node.id + '" data-id="' + node.id + '" class="panel-body node ' + node.element_type + ' node_' + node.id + '">')
    div.push('<div class="content" ')
    div.push('style="border-left: 4px solid ' + colors[node.id % colors.length] + '">')
    div.push('<label style="padding-left:15px;min-width: 200px;">Model</label>')
    div.push('<div class="btn-group">')
    div.push('<select data-id="' + node.id + '" class="' + node.element_type + 'Select modelSelect form-control btn btn-default disableOnRunning">')
    div.push('<option disabled selected hidden>Select an ' + node.element_type + ' device</option>')
    div.push('</select>')
    div.push('<button class="btn btn-default disableNode hideOnDrawing disableOnRunning">')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon-ok"></span>')
    div.push('<span class="glyphicon glyphicon-menu-glyphicon glyphicon glyphicon-remove"></span>')
    div.push('</button>')
    div.push('</div>')
    div.push('<div class="nodeSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('<div class="modelSlider hideOnDrawing" style="display:hidden"></div>')
    div.push('<div class="selection hideOnDrawing" style="display:hidden"></div>')
    div.push('</div></div>')
    // div.push('<hr>')
    return div.join('')
}


module.exports = nodeRenderer;
