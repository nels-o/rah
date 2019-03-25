const { resolve } = require('path');
const pullAll = require('lodash/pullAll');
const uniq = require('lodash/uniq');

const RAH = {
  // This refers to the react-boilerplate version this project is based on.
  version: '3.6.0',

  /**
   * The DLL Plugin provides a dramatic speed increase to webpack build and hot module reloading
   * by caching the module metadata for all of our npm dependencies. We enable it by default
   * in development.
   *
   *
   * To disable the DLL Plugin, set this value to false.
   */
  dllPlugin: {
    defaults: {
      /**
       * we need to exclude dependencies which are not intended for the browser
       * by listing them here.
       */
      exclude: [
        'chalk',
        'compression',
        'cross-env',
        'express',
        'ip',
        'minimist',
        'sanitize.css',
      ],

      /**
       * Specify any additional dependencies here. We include core-js and lodash
       * since a lot of our dependencies depend on them and they get picked up by webpack.
       */
      include: [
        'core-js',
        'eventsource-polyfill',
        'babel-polyfill',
        'lodash',
        'rcl',
      ],

      // The path where the DLL manifest and bundle will get built
      path: 'node_modules/rah-dlls',
    },

    entry(pkg) {
      const dependencyNames = Object.keys(pkg.dependencies);
      const targetPackage = require(process.cwd() + '/package.json');
      const targetPackageDependencies = Object.keys(targetPackage.dependencies) || [];
      const dllPlugin = targetPackage.dllPlugin || {};
      const exclude = uniq(RAH.dllPlugin.defaults.exclude.concat(pkg.dllPlugin.exclude).concat(dllPlugin.exclude || [])) ;
      const include = uniq(RAH.dllPlugin.defaults.include.concat(pkg.dllPlugin.include).concat(dllPlugin.include || []))
        pkg.dllPlugin.include || RAH.dllPlugin.defaults.include;
      const includeDependencies = uniq(dependencyNames.concat(include).concat(targetPackageDependencies));
      
      return {
        rahDeps: pullAll(includeDependencies, exclude),
      };
    },
  },
};

module.exports = RAH;
