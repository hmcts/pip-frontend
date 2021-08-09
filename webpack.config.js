const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sourcePath = path.resolve(__dirname, 'src/main/');
const govukFrontend = require(path.resolve(__dirname, 'webpack/govukFrontend'));
const scss = require(path.resolve(__dirname,'webpack/scss'));
const HtmlWebpack = require(path.resolve(__dirname,'webpack/htmlWebpack'));
const customScripts = require(path.resolve(__dirname,'webpack/customScripts'));
const autocomplete = require(path.resolve(__dirname,'webpack/accessible-autocomplete'));

const devMode = process.env.NODE_ENV !== 'production';
const fileNameSuffix = devMode ? '-dev' : '.[contenthash]';
const filename = `[name]${fileNameSuffix}.js`;

module.exports = {
  plugins: [...govukFrontend.plugins, ...scss.plugins, ...HtmlWebpack.plugins, ...customScripts.plugins, ...autocomplete.plugins ],
  entry: path.resolve(sourcePath, 'index.js') ,
  mode: devMode ? 'development': 'production',
  module: {
    rules: [...scss.rules],
  },
  output: {
    path: path.resolve(__dirname, 'src/main/public/'),
    publicPath: '',
    filename,
  },
};
