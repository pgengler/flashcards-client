/* global require, module */
'use strict';

const path = require('path');
const resolve = require('resolve');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  treeForStyles() {
    let basePath = path.dirname(resolve.sync('bootstrap/package.json', { basedir: this.app.project.root }));
    let stylesPath = path.join(basePath, 'scss');
    return new Funnel(stylesPath, {
      destDir: 'bootstrap',
    });
  },
};
