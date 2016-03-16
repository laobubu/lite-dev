'use strict'

var fs = require('fs');
var path = require('path');

var config = {
    global: {
        src: ".",
        dst: "."
    },
    watcherList: ["sass", "typescript"],
    watcher: {
    }
};

function exists(filename) { try { fs.accessSync(filename); return true } catch (err) { return false } }
function guessPath(guessList, defaultValue, prefixDir) {
    for (var i = 0; i < guessList.length; i++) {
        let name = guessList[i];
        let nameFull = prefixDir ? path.join(prefixDir, name) : name;
        if (exists(nameFull)) return nameFull;
    }
    return defaultValue;
}

/** init global */
config.global.dst = guessPath(["dst", "dest", "dist"], ".");
config.global.src = guessPath(["src"], ".");

/** init watcher */
config.watcherList.forEach(name => {
    var guess = require('./watcher/' + name + '.js').guess;
    var ins = {
        src: guessPath(guess.src, null, config.global.src),
        dst: guessPath(guess.dst, null, config.global.dst)
    };
    if (ins.dst && ins.src)
        config.watcher[name] = ins;
})

module.exports = config;
