[![npm version](https://badge.fury.io/js/lite-dev.svg)](https://www.npmjs.com/package/lite-dev)

# lite-dev

Lightweight development server and compiler.

This will be your good friend when you just want to build a simple website, but not willing to see Makefile, Gulpfile or any redundant blahblah scripts.

## How to use

1. Install `npm install -g lite-dev`
2. Open your Terminal on your web directory `cd /works/foo-website/` 
3. Run `lite-dev`

## Game Rule

### Directory Structure

Just put everything together. For example:

- index.html
- about.html
- scss
  - style.scss
  - _misc
    - variable.scss
    - mixin.scss
- css
  - (empty directory; the destination directory of Sass compiler)
- js
  - jQuery.min.js
  - index.js
  
### Command Options

```
  -h, --help       Show options message.
  -c, --compile    Compile only. BrowserSync will not run.
  -m, --map        Generate SourceMap data.
  -o, --once       Don't watch changes. One-shot compilation.
  -p, --port PORT  BrowserSync port. Works even if "bs-config.json" file exists.
```

### SASS or SCSS

First of all, if you don't have a sass compiler, install one:

- For most computers, `npm install -g node-sass`
- For some moribund outdated computers, `npm install -g sass.js`

And here we go.
   
1. Create a source directory named as `scss` or `sass`.
2. Create a destination directory named as `css`, `style` or `stylesheet`.
3. Compose your scss files.
4. Run `lite-dev`, and your scss files will be compiled and watched.

Notice: sass/scss files under subdirectories will be ignored.

### TypeScript

First of all, if you don't have a TypeScript compiler, install one with `npm install -g typescript`

1. Create your `tsconfig.json` file, or... 
    - Create a source directory named as `typescript` or `ts`.
    - Create a destination directory named as `javascript`, `js` or `script`.
    - lite-dev runs `tsc` with `--target es5` by default.
    - The ts files under subdirectories will be ignored.
2. Compose your TypeScript files.
3. Run `lite-dev`, and your TypeScript files will be compiled and watched.
