"use strict"

const hash = require('object-hash');

module.exports = function(data) {
    return hash({
        nodes: data.nodes.map(function(node) {
            return {
                model: node.model,
                n: node.n,
                params: node.params
            }
        }),
        links: data.links
    })
}
