'use strict';

var path = require('path');
var requireg = require('requireg');
var solver = (srcFile, dstFile) => (res, rej) => rej('Cannot find a sass compiler!');

(_ => {
    try {
        var nodeSass = requireg('node-sass');
        solver = (srcFile, dstFile) => (res, rej) => {
            nodeSass.render({
                file: srcFile,
                outFile: dstFile,
                sourceMap: true,
                sourceMapContents: true
            }, (err, result) => {
                if (!err) {
                    res({
                        css: result.css,
                        map: result.map || "",
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
        solver = (srcFile, dstFile) => (res, rej) => {
            sassJs.compileFile(srcFile, {
                sourceMap: true,
                sourceMapOmitUrl: false,
                outputPath: path.dirname(dstFile),
                sourceMapRoot: path.dirname(dstFile)
            }, result => {
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


module.exports = function(sassFilename, cssFilename) {
    return new Promise(solver(sassFilename, cssFilename));
};
