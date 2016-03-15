/// <reference path="../typings/node/node.d.ts" />

var fs = require('fs');

var watches = {};

function trig(filename) {
    watches[filename].callback.forEach(callback => callback(filename))
}

function addWatch(filename, callback) {
    if (filename instanceof Array) {
        filename.forEach(fn => addWatch(fn, callback));
        return;
    }
    if (!watches[filename]) {
        //start watching something
        watches[filename] = {
            watcher: fs.watch(filename, trig.bind(this, filename)),
            callback: new Set()
        }
    }
    watches[filename].callback.add(callback);
}

function removeAllWatch(filename) {
    if (filename instanceof Array) {
        filename.forEach(fn => removeAllWatch(fn, callback));
        return;
    }
    watches[filename].callback.clear();
    setTimeout(_remove.bind(this, filename), 10);
}

function _remove(filename) {
    if (!watches[filename]) return;
    if (watches[filename].callback.size) return;
    try {
        watches[filename].watcher.close();
    } catch (err) {
    }
    delete watches[filename];
}

function removeWatch(filename, callback) {
    if (filename instanceof Array) {
        filename.forEach(fn => removeWatch(fn, callback));
        return;
    }
    if (!watches[filename]) return;
    watches[filename].callback.delete(callback);
    if (watches[filename].callback.size === 0) {
        removeAllWatch(filename);
    }
}

module.exports.addWatch = addWatch;
module.exports.removeWatch = removeWatch;
module.exports.removeAllWatch = removeAllWatch;
