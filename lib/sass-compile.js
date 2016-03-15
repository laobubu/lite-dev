'use strict';

var requireg = require('requireg');
var solver = _ => (res, rej) => rej('Cannot find a sass compiler!');

(_ => {
    try {
        var nodeSass = requireg('node-sass');
        solver = filename => (res, rej) => {
            nodeSass.render({
                file: filename
            }, (err, result) => {
                if (!err) {
                    res({
                        css: result.css,
                        map: result.map,
                        files: result.stats.includedFiles
                    })
                } else {
                    rej(`(${err.line}, ${err.column}) at ${err.file}\n${err.message}`)
                }
            })
        }
        return;
    } catch (err) { }

    try {
        var nodeSass = requireg('node-sass');
        solver = filename => (res, rej) => {
            nodeSass.render({
                file: filename
            }, (err, result) => {
                if (!err) {
                    res({
                        css: result.css,
                        map: result.map,
                        files: result.stats.includedFiles
                    })
                } else {
                    rej(`(${err.line}, ${err.column}) at ${err.file}\n${err.message}`)
                }
            })
        }
        return;
    } catch (err) { }

    try {
        var sassJs = requireg('sass.js');
        solver = filename => (res, rej) => {
            sassJs.compileFile(filename, result => {
                if (result.status === 0) {
                    res({
                        css: result.text,
                        map: result.map,
                        files: result.files
                    })
                } else {
                    rej(`(${result.line}, ${result.column}) at ${result.file}\n${result.formatted}`)
                }
            })
        }
        return;
    } catch (err) { }

    console.error('Cannot find a sass compiler! Install one with `npm install -g node-sass`')

})();


module.exports = function(sassFilename) {
    return new Promise(solver(sassFilename));
};
