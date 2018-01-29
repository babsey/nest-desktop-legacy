"use strict"

const hash = require('object-hash');

module.exports = (data) => hash({
    name: data.name,
    description: (data.description || ""),
    network: data.network,
    kernel: data.kernel,
    random_seed: data.random_seed,
    nodes: data.nodes.map((node) => {
        var saved_node = {
            model: node.model,
            n: node.n,
            params: node.params,
        };
        // if (node.model == 'multimeter') {
        //     saved_node.data_from = node.data_from;
        // }
        // if (node.model == 'spike_detector') {
        //     saved_node.nbins = node.nbins;
        // }
        // if (node.model == 'spike_generator') {
        //     saved_node.spike_dtime = node.spike_dtime;
        //     saved_node.spike_weight = node.spike_weight || 1.0;
        // }
        // if (node.model == 'step_current_generator') {
        //     saved_node.amplitude_dtime = node.amplitude_dtime;
        //     saved_node.amplitude_dvalue = node.amplitude_dvalue;
        // }
        return saved_node
    }),
    links: data.links
})
