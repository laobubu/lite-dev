'use strict';

var browserSync = require("browser-sync");
var path = require('path');

const TAG = '\x1b[2m[BS]\x1b[0m ';

module.exports.start = function() {
    var config = global.config;
    var options = {
        injectChanges: true,
        files: [path.join(config.global.dst, '**', '*')],
        server: {
            baseDir: config.global.dst
        }
    };
    
    try {
        var bsConfigPath = path.resolve("bs-config");
        options = require(bsConfigPath);
        console.log(TAG + "Loaded custom bs-config");
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') throw err;
    }
    
    var port = parseInt(global.argv.port);
    if (port) options.port = port;
    
    browserSync(options);
}
