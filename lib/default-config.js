'use strict'

var fs = require('fs');
var path = require('path');

var config = {
    global: {
        src: ".",
        dst: "."
    },
    sass: {
        src: null,
        dst: null
    }
};

function isDir(dir) { try { fs.accessSync(dir); return true } catch (err) { return false } }

/** init global */

["dst", "dest", "dist"].some(name => {
    if (isDir(name)) {
        config.global.dst = name
        return true
    }
    return false
});

["src"].some(name => {
    if (isDir(name)) {
        config.global.src = name
        return true
    }
    return false
});

/** init sass */

["sass", "scss"].some(name => {
    if (isDir(path.join(config.global.src, name))) {
        config.sass.src = name
        return true
    }
    return false
});

["style", "css", "stylesheet"].some(name => {
    if (isDir(path.join(config.global.dst, name))) {
        config.sass.dst = name
        return true
    }
    return false
});

if (!config.sass.src || !config.sass.dst) delete config.sass;

for (let key in config) {
    if (key === "global") continue;
    if (config[key].src) config[key].src = path.join(config.global.src, config[key].src);
    if (config[key].dst) config[key].dst = path.join(config.global.dst, config[key].dst);
}

module.exports = config;
