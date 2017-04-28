"use strict"

const hash = require('object-hash');

module.exports = function(data) {
    return hash({
        name: data.name,
        description: (data.description || ""),
        network: data.network,
        kernel: data.kernel,
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
