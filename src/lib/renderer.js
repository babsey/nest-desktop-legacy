"use strict"

var renderer = {
    simulation: require('./renderer/simulation'),
    protocol: require('./renderer/protocol'),
    node: require('./renderer/node'),
    link: require('./renderer/link'),
};

module.exports = renderer;
