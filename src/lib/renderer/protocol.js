"use strict"

var protocolRenderer = {};

protocolRenderer.popover = (data) => {
    var div = [];
    div.push('<img style="width:250px" src="' + $('#' + data._id).data('img') + '" />')
    div.push('<small>')
    data.nodes.map((node) => div.push(app.renderer.node.list(node)))
    div.push('<hr>')
    data.links.map((link) => div.push(app.renderer.link.list(link)))
    div.push('</small>')
    return div.join('')
}

module.exports = protocolRenderer;
