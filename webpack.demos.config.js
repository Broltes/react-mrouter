var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");
var assets = 'demos';
var dist = '../github.io/router';

module.exports = {
    context: path.resolve(assets),
    entry: [
        'babel-polyfill',
        './app.jsx'
    ],
    output: {
        path: path.resolve(dist),
        filename: '[name].js?[chunkhash]'
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new HtmlWebpackPlugin({ template: 'index.html' })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve('./src')
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    'babel?presets[]=react,presets[]=es2015'
                ]
            }, {
                test: /\.less$/,
                loaders: [
                    'style',
                    'css?-minimize',
                    'postcss',
                    'less'
                ]
            }
        ]
    },

    postcss: function () {
        return [
            require('autoprefixer')({ browsers: ["Android >= 4", "iOS >= 7"]})
        ];
    }
};
