# clippy the github extension

![Screenshot](https://raw.githubusercontent.com/aleph-naught2tog/clippy/master/doc/screen_shot.png)

* `tsc` to compile
* `node build` to build the extension

TODO: installation instructions

for testing/local use:
1. Turn on "developer mode" in the [Chrome extensions dashboard](chrome://extensions)
2. Select 'load unpacked'
3. Choose the folder that contains the `manifest.json` file; currently, that is `<project_root>/dist`.

## about the build

(the module loading/bundling was just a neat way to test something; it only handles flat stuff right now, so)

* tsc compiles things to the tmp folder
* `build.js`
  * checks the tmp folder
  * takes those files
  * rewrites their import/export statements (currently we are lightly aggregating meadata on them as we go, butth file count is so low here it's negligible)
  * concatenate the files together
