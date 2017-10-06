"use strict"

const path = require('path');
const jsonfile = require('jsonfile');
const uuidV4 = require('uuid/v4');

var config = {};

config.app = () => require(path.join(process.cwd(), 'config', 'app.json'));

config.save = (filename, config) => {
    jsonfile.writeFile(path.join(process.cwd(), 'config', filename + '.json'), config, {
        spaces: 4
    }, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

config.nest = (name) => jsonfile.readFileSync(path.join(process.cwd(), 'config', 'nest', name + '.json'));

module.exports = config
