'use strict';

var fs = require('fs');
var path = require('path');
var sassCompile = require('../util/sass.js');
var batchWatch = require('../util/watch.js');

const TAG = '\x1b[2m[SASS]\x1b[0m ';

/**
 * start watching a sass file
 * 
 * @param {string} src path to src sass file
 * @param {string} dst path to output css file
 * 
 */
function watchSass(src, dst, config) {
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

        console.log(TAG + 'Compile ' + src);
        sassCompile(src, dst).then(result => {
            console.log(TAG + 'Finished ' + src);
            fs.writeFileSync(dst, result.css);
            if (global.argv['map']) {
                //Source Map
                fs.writeFileSync(dst + ".map", result.map);
            }
            if (!global.argv['once']) {
                batchWatch.removeWatch(lastWatchList, requestWork);
                batchWatch.addWatch(lastWatchList = result.files, requestWork);
            }
            afterWork(true);
        }).catch(error => {
            console.error(TAG + 'Failed to compile ' + src);
            console.error(error);
            afterWork(false);
        })
    }

    requestWork();
}

function start(_conf) {
    var config = {
        src: "",
        dst: "",
        callback: null // or (filename, successful) => void
    };
    Object.assign(config, _conf);

    fs.readdir(config.src, (err, fileNames) => {
        if (err) return;
        var tail = /\.s[ca]ss$/i;
        var namePattern = /^[^_].*\.s[ca]ss$/i;

        fileNames.filter(fileName => namePattern.test(fileName))
            .forEach(fileName => {
                watchSass(
                    path.join(config.src, fileName),
                    path.join(config.dst, fileName.replace(tail, '.css')),
                    config
                );
            });
    })
}

module.exports = {
    guess: {
        src: ["sass", "scss"],
        dst: ["style", "css", "stylesheet"]
    },
    start: start
}
