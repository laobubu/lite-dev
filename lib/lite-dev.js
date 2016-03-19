'use strict';

var argv = require('./argv-parse.js');
var browserSync = require("browser-sync");
var config = require('./config.js');
var path = require('path');

global.argv = argv;
global.config = config;
global.watcher = {};

const TAG = '\x1b[2m[SYS]\x1b[0m ';

if (argv.compile) {
    console.log(TAG + 'BrowserSync is disabled.');
} else {
    browserSync({
        injectChanges: true,
        files: [path.join(config.global.dst, '**', '*')],
        server: {
            baseDir: config.global.dst
        }
    });
}

var universal_callback = function(filename, successful) {
    if (successful) browserSync.reload({ stream: true });
}

config.watcherList.forEach(watchName => {
    var watchConfig = config.watcher[watchName];
    if (watchConfig) {
        var watchModule = require('./watcher/' + watchName + '.js');
        var watchInstance = watchModule.start(watchConfig);
        global.watcher[watchName] = watchInstance;
        console.log(TAG + "Loaded " + watchName + ": " + watchConfig.src + " => " + watchConfig.dst);
    }
})
