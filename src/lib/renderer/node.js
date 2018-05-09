"use strict"

var nodeRenderer = {};

nodeRenderer.table = (node) => {
    var configApp = app.config.app();
    var level = configApp.controller.level;
    var nodes = app.config.nest(node.element_type);
    var models = nodes.map((d) => d.id);
    var nodeIdx = models.indexOf(node.model);
    var params = nodes[nodeIdx].sliderDefaults.map((d) => d.id);
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
        var paramIdx = params.indexOf(pkey);
        if (paramIdx != -1) {
            if (level < nodes[nodeIdx].sliderDefaults[paramIdx].level) continue;
        }
        div.push('<tr class="node" ')
        div.push('style="border-left: 4px solid ' + colors[node.id % colors.length] + '" ')
        div.push('level="' + level + '">')
        div.push('<td>' + pkey + '</td>')
        var val = node.params[pkey];
        val = Array.isArray(val) ? app.format.truncateList(node.params[pkey], 6) : val
        div.push('<td>' + val + '</td>')
        div.push('</tr>')
    }
    return div.join('')
}

nodeRenderer.list = (node) => {
    var div = []
    var colors = app.graph.colors();
    div.push('<div style="border-left: 2px solid ' + colors[node.id % colors.length] + '; margin: 5px; padding: 3px">')
    div.push('<dl><dt>model</dt><dd>' + app.format.nodeTitle(node) + '</dd></dl>')

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
    div.push('</div>')
    return div.join('')
}

nodeRenderer.spy = (node) => {
    var div = [];
    div.push('<li class="node ' + node.element_type + ' ' + (node.disabled ? 'disabled' : '') + '" data-id="' + node.id + '">')
    var colors = app.graph.colors();
    div.push('<a style="border-color: ' + colors[node.id % colors.length] + '; padding: 10px 0px"')
    div.push(' title="' + app.format.nodeTitle(node) + '">')
    // div.push(app.format.nodeLabel(node))
    div.push(node.id)
    div.push('</a></li>')
    return div.join('')
}

nodeRenderer.controller = (node) => {

    // var selectModel = '<label style="min-width: 200px;">Model</label>' +
    //     '<select class="nodeSelect modelSelect form-control btn btn-default disableOnRunning">' +
    //     '</select>';

    var deleteButton = '<div class="btn-group showOnDrawing">' +
        '<button class="btn btn-default deleteNode">' +
        '<i class="fa fa-trash-o"></i>' +
        '</button>' +
        '</div>';

    var nodeConfig = '<div class="dropdown btn-group hideOnDrawing nodeConfig">' +
        '<button type="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown">' +
        '<i class="fa fa-check enabled"></i>' +
        '<i class="fa fa-ban disabled"></i>' +
        '</button>' +
        '<ul class="dropdown-menu dropdown-menu-right">' +
        '<li><a class="resetParameters" href="#"><i class="fa fa-edit"></i> Reset all parameters</a></li>' +
        '<li><a class="disableNode disabled" href="#"><i class="fa fa-heartbeat"></i> Enable this node</a></li>' +
        '<li><a class="disableNode enabled" href="#"><i class="fa fa-ban"></i> Disable this node</a></li>' +
        '<li role="separator" class="divider"></li>' +
        '<li><a class="deleteNode" href="#"><i class="fa fa-trash-o"></i> Delete this node</a></li>' +
        '</ul>' +
        '</div>';

    var modelSelect = '<label style="padding-left: 15px;">Model</label>' +
        '<div class="btn-group">' +
        '<div class="btn-group dropdown select nodeSelect modelSelect">' +
        '<button class="btn btn-default dropdown-toggle disableOnSimulate disableOnRunning" type="button" data-toggle="dropdown">' +
        '<span class="name">Select a node model</span> ' +
        '</button>' +
        '<ul class="dropdown-menu"></ul>' +
        '</div>' +
        deleteButton +
        nodeConfig +
        '</div>';

    var subchartView = '<div class="subchart-view">' +
        '<div><label>Subchart</label></div>' +
        '<div class="btn-group dropdown select">' +
        '<button type="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown">No subchart</button>' +
        '<ul class="dropdown-menu"></ul>' +
        '</div>' +
        '</div>';

    var subchartOrdinate = '<div class="subchart-ordinate">' +
        '<div><label>Subchart ordinate</label></div>' +
        '<div class="btn-group dropdown select">' +
        '<button type="button" class="btn btn-default dropdown-toggle disableOnRunning" data-toggle="dropdown">No subchart</button>' +
        '<ul class="dropdown-menu"></ul>' +
        '</div>' +
        '</div>';

    var subchart = '<div class="subchart">' +
        subchartView +
        (node.model == 'spike_detector' ? subchartOrdinate : '') +
        '<div class="slider"></div>' +
        '</div>';

    var nodeParams = '<div class="hideOnDrawing">' +
        '<div class="nodeSlider"></div>' +
        '<div class="modelSlider"></div>' +
        '<div class="dataSelect"></div>' +
        (node.element_type == 'recorder' ? subchart : '') +
        '</div';

    var colors = app.graph.colors();
    var html = '<div data-id="' + node.id + '" class="panel-body node ' +
        node.element_type + '">' +
        '<div class="content" ' +
        'style="border-left: 4px solid ' + colors[node.id % colors.length] + '">' +
        modelSelect +
        nodeParams +
        '</div>' + '</div>';

    return html
}


module.exports = nodeRenderer;
