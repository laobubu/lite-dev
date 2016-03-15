'use strict';

var fs = require('fs');
var path = require('path');
var sassCompile = require('../util/sass.js');
var batchWatch = require('../util/watch.js');
var config = { src: "", dst: "", callback: null };

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
    var lastWatchList = [];

    function requestWork() {
        queued = true;
        nextTrig();
    }

    function afterWork(success) {
        working = false;
        if (queued) nextTrig();
        else if (config.callback) config.callback(src, success);
    }

    function nextTrig() {
        if (working || !queued) return;
        working = true;
        queued = false;

        console.log('[SASS] Compile ' + src);
        sassCompile(src).then(result => {
            console.log('[SASS] Finished ' + src);
            fs.writeFileSync(dst, result.css);
            batchWatch.removeWatch(lastWatchList, requestWork);
            batchWatch.addWatch(lastWatchList = result.files, requestWork);
            afterWork(true);
        }).catch(error => {
            console.error('[SASS] Failed to compile ' + src);
            console.error(error);
            afterWork(false);
        })
    }

    requestWork();
}

function start() {
    fs.readdir(config.src, (err, fileNames) => {
        if (err) return;
        var tailTest = /\.s[ca]ss$/i;
        fileNames.filter(fileName => tailTest.test(fileName))
            .forEach(fileName => {
                watchSass(
                    path.join(config.src, fileName),
                    path.join(config.dst, fileName.replace(tailTest, '.css'))
                );
            });
    })
}

module.exports = function(_conf) { config = _conf; start(); }
