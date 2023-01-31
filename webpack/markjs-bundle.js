const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootExport = require.resolve('mark.js');
const root = path.resolve(rootExport, '..');
const javascript = path.resolve(root, 'mark.min.js');

const copyMarkJsAssets = new CopyWebpackPlugin({
    patterns: [{ from: javascript, to: 'assets/js' }],
});

module.exports = {
    paths: { template: root, javascript },
    plugins: [copyMarkJsAssets],
};
