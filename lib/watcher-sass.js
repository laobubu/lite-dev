'use strict';

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

var sassCompile = require('./sass-compile.js');
var config = { src: "", dst: "" };

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

exports = function(_conf) { config = _conf; start(); }
