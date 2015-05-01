# stitch-js
A script to "stitch" script files together before release.

### Installation
Simply run `npm install -g stitch-js`

### Getting Started
Stitch.js is simple to get started with. First of all, add `|#IMPORT_FILE <filename>[:linenumber]#|` anywhrere in your script then run `stitchjs original-script output-script` for example, `stitchjs example.js release.js`. This will read example.js and replace any file import lines then output the results to release.js which can then be run with `node release.js`.
