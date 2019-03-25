/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const { join } = require('path');
const defaults = require('lodash/defaultsDeep');
const webpack = require('webpack');
const pkg = require(join(process.cwd(), 'package.json'));
const rahPkg = require(join(process.cwd(), 'node_modules/rah/package.json'));
const { dllPlugin } = require('../config');

// console.log(pkg)
let appDLL = {};
if (pkg.dllPlugin) {
  appDLL = pkg.dllPlugin;
}

const dllConfig = defaults(appDLL, rahPkg.dllPlugin, dllPlugin.defaults);
const outputPath = join(process.cwd(), dllConfig.path);
console.log(dllConfig)

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  context: process.cwd(),
  entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(rahPkg),
  optimization: {
    minimize: false,
  },
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: join(outputPath, '[name].json'),
    }),
  ],
  performance: {
    hints: false,
  },
});
