'use strict';

var browserSync = require("browser-sync");
var config = require('./default-config.js');

browserSync({
    injectChanges: true,
    files: [path.join(config.global.dst, '**', '*')],
    server: {
        baseDir: config.global.dst
    }
});

if (config.sass) {
    console.log("[SASS] " + config.sass.src + " => " + config.sass.dst);
    require('./watcher-sass.js')(config.sass);
} else {
    console.log("[SASS] sass is disabled. no sufficient config.");
}
