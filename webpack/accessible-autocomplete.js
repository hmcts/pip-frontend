const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const packageJson = require.resolve('accessible-autocomplete/package.json');
const root = path.resolve(packageJson, '..', 'govuk');
const sass = path.resolve(root, 'all.scss');
const javascript = path.resolve(root, 'all.js');
const assets = path.resolve(root, 'assets');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [{ from: 'src/main/assets/js/', to: 'assets/js' }],
});

module.exports = {
  paths: { template: root, sass, javascript, assets },
  plugins: [copyGovukTemplateAssets],
};
