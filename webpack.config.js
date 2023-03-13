const path = require('path');

const sourcePath = path.resolve(__dirname, 'src/main/bundles');
const govukFrontend = require(path.resolve(__dirname, 'webpack/govukFrontend'));
const mojFrontend = require(path.resolve(__dirname, 'webpack/ministryOfJusticeFrontend'));
const jquery = require(path.resolve(__dirname, 'webpack/jquery'));
const scss = require(path.resolve(__dirname, 'webpack/scss'));
const HtmlWebpack = require(path.resolve(__dirname, 'webpack/htmlWebpack'));
const autocomplete = require(path.resolve(__dirname, 'webpack/accessible-autocomplete'));
const markJs = require(path.resolve(__dirname, 'webpack/markjs-bundle'));

const devMode = process.env.NODE_ENV !== 'production';
const fileNameSuffix = devMode ? '-dev' : '.[contenthash]';
const filename = `[name]${fileNameSuffix}.js`;

module.exports = {
    plugins: [
        ...govukFrontend.plugins,
        ...scss.plugins,
        ...HtmlWebpack.plugins,
        ...autocomplete.plugins,
        ...mojFrontend.plugins,
        ...jquery.plugins,
        ...markJs.plugins,
    ],
    entry: {
        main: path.resolve(sourcePath, 'index.js'),
        cookies: path.resolve(sourcePath, 'cookie-preferences.ts'),
    },
    mode: devMode ? 'development' : 'production',
    module: {
        rules: [
            ...scss.rules,
            {
                test: /\.ts$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    output: {
        path: path.resolve(__dirname, 'src/main/public/'),
        publicPath: '',
        filename,
    },
};
