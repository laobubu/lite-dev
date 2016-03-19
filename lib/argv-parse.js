/// <reference path="../typings/node/node.d.ts" />

'use strict';

var argv = require('minimist')(process.argv.slice(2));

[
    'help h',
    'compile c',
    'map m'
].forEach(str => {
    var a = str.split(' '), name = a[0];
    a.some(alias => argv[alias] && (argv[name] = alias)) || (argv[name] = false);
    if (argv[name] === 'false') argv[name] = false;
})

if (argv['help']) {
    console.log(`
Syntax
  lite-dev [-h] [-cm]

Options:
  -h, --help       Show these message.
  -c, --compile    Compile only. BrowserSync will not run.
  -m, --map        Generate SourceMap data.
`.trim());
    process.exit(0);
}

module.exports = argv;
