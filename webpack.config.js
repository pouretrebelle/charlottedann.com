'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (webpackEnv) => {
  const isProduction = webpackEnv === 'production'

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: 'eval-source-map',
    entry: [path.join(__dirname, 'src/main.js')],
    output: {
      path: path.join(__dirname, '/docs/'),
      filename: '[name].js',
      publicPath: '/',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.pug',
        inject: 'body',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.pug?$/,
          loaders: ['html-loader', 'pug-html-loader'],
        },
        {
          test: /\.s[ca]ss$/,
          loaders: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['postcss-preset-env'],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|ico)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      ],
    },
    resolve: {
      modules: ['src', 'node_modules'],
      alias: {
        styles: path.resolve('src', 'styles'),
      },
    },
  }
}
