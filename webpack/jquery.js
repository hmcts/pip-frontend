const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const packageJson = require.resolve('jquery/package.json');
const root = path.resolve(packageJson, '..', 'dist');
const javascript = path.resolve(root, 'jquery.js');

const copyJqueryAssets = new CopyWebpackPlugin({
    patterns: [{ from: javascript, to: 'assets/js' }],
});

module.exports = {
    paths: { template: root, javascript },
    plugins: [copyJqueryAssets],
};
