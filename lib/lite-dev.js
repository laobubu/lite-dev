'use strict';

var browserSync = require("browser-sync");
var config = require('./config.js');
var path = require('path');

global.config = config;

browserSync({
    injectChanges: true,
    files: [path.join(config.global.dst, '**', '*')],
    server: {
        baseDir: config.global.dst
    }
});

var universal_callback = function(filename, successful) {
    if (successful) browserSync.reload({ stream: true });
}

config.watcherList.forEach(watchName => {
    var watchConfig = config.watcher[watchName];
    if (watchConfig) {
        var watchInstance = require('./watcher/' + watchName + '.js');
        watchInstance.start(watchConfig);
        console.log("[" + watchName + "] " + watchConfig.src + " => " + watchConfig.dst);
    }
})
