/// <reference path="../../typings/node/node.d.ts" />

'use strict';

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

const TAG = '\x1b[2m[TSC]\x1b[0m ';

function start(_conf) {
    var config = {
        src: "",
        dst: "",
        callback: null // or (filename, successful) => void
    };
    Object.assign(config, _conf);

    var isWindows = /^win/i.test(process.platform);
    var tsc = isWindows ? 'tsc.cmd' : 'tsc';

    var commands = [];

    if (!global.argv['once']) commands.push("-w"); //oneshot compilation
    if (global.argv['map']) commands.push("--sourceMap"); //sourceMap

    if (config.src.endsWith("tsconfig.json")) {
        commands.push("-p", config.src);
    } else {
        commands.push("--rootDir", config.src);
        commands.push("--outDir", config.dst);
        commands.push("--target", "ES5");
        fs.readdirSync(config.src).forEach(
            name => {
                if (!/\.ts$/i.test(name)) return;
                commands.push(path.join(config.src, name));
            }
        );
    }

    function tsOut(data) {
        var d2 = '' + data;
        console.log(TAG + d2.trim().replace(/[\r\n]+/g, '\n' + TAG));
    }

    var proc = child_process.spawn(tsc, commands);
    proc.stdout.on('data', tsOut);
    proc.stderr.on('data', tsOut);
    proc.on('close', code => { console.log(TAG + "Exited with " + code); });
}

module.exports = {
    guess: {
        src: ["tsconfig.json", "typescript", "ts"],
        dst: ["tsconfig.json", "javascript", "js", "script"]
    },
    start: start
}
