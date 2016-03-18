'use strict';

var browserSync = require("browser-sync");
var config = require('./config.js');
var path = require('path');

global.config = config;
global.watcher = {};

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
        var watchModule = require('./watcher/' + watchName + '.js');
        var watchInstance = watchModule.start(watchConfig);
        global.watcher[watchName] = watchInstance;
        console.log("[SYS] Loaded " + watchName + ": " + watchConfig.src + " => " + watchConfig.dst);
    }
})
