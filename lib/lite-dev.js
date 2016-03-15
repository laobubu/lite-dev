'use strict';

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var browserSync = require("browser-sync");
var sassCompile = require('./sass-compile.js');

/**
 * start watching a sass file
 * 
 * @param {string} src path to src sass file
 * @param {string} dst path to output css file
 * 
 */
function watchSass(src, dst) {
    var queued = true;
    var working = false;

    function requestWork() {
        queued = true;
        nextTrig();
    }

    function afterWork(success) {
        working = false;
        if (queued) nextTrig();
        else if (success) browserSync.reload();
    }

    function nextTrig() {
        if (working || !queued) return;
        working = true;
        queued = false;

        console.log('[SASS] Compile ' + src);
        sassCompile(src).then(result => {
            console.log('[SASS] Finished ' + src);
            fs.writeFileSync(dst, result.css);
            afterWork(true);
        }).catch(error => {
            console.error('[SASS] Failed to compile ' + src);
            console.error(error);
            afterWork(false);
        })
    }

    fs.watchFile(src, requestWork);
    requestWork();
}

var config = {
    global: {
        src: ".",
        dst: "."
    },
    sass: {
        src: "scss",
        dst: "style"
    }
};

//TODO: Read config from command arguments
////////////////////////////////////////////////

for (let key in config) {
    if (key === "global") continue;
    if (config[key].src) config[key].src = path.join(config.global.src, config[key].src);
    if (config[key].dst) config[key].dst = path.join(config.global.dst, config[key].dst);
}

browserSync({
    injectChanges: true,
    files: [path.join(config.global.dst, '**', '*')],
    server: {
        baseDir: config.global.dst
    }
});

fs.readdir(config.sass.src, (err, fileNames) => {
    if (err) return;
    var tailTest = /\.s[ca]ss$/i;
    fileNames.filter(fileName => tailTest.test(fileName))
        .forEach(fileName => {
            watchSass(
                path.join(config.sass.src, fileName),
                path.join(config.sass.dst, fileName.replace(tailTest, '.css'))
            );
        });
})
