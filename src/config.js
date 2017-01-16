"use strict"

const Config = require('electron-config');
const uuidV4 = require('uuid/v4');

const config = new Config({
    defaults: {
        user: {
            name: "",
            password: "",
        },
        windowBounds: {
            width: 1280,
            height: 768,
        },
        window: {
            frame: false,
            fullscreen: false
        },
        nestServer: {
            host: 'localhost',
            port: '5000'
        },
        db_name: 'network-' + uuidV4(),
        localDB: {
            path: './data',
        },
        remoteDB: {
            host: '',
            port: '',
        },
        level: 1
    }
});

module.exports = config
