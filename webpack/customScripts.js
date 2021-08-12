const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [
    { from: 'src/main/assets/js/back-to-top.js', to: 'assets/js' },
  ],
});

module.exports = {
  plugins: [copyGovukTemplateAssets],
};
