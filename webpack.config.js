const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/js/main.js',
    login: './src/js/login.js',
    register: './src/js/register.js',
    slideshow: './src/js/slideshow.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/', // This is the crucial addition
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'assets/fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'assets/images/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html',
      chunks: ['login'],
    }),
    new HtmlWebpackPlugin({
      template: './public/register.html',
      filename: 'register.html',
      chunks: ['register'],
    }),
    new HtmlWebpackPlugin({
      template: './public/slideshow.html',
      filename: 'slideshow.html',
      chunks: ['slideshow'],
    }),
    new HtmlWebpackPlugin({
      template: './public/disclaimer.html',
      filename: 'disclaimer.html',
      chunks: [],
    }),
    new CopyWebpackPlugin({
        patterns: [
            // Correctly copies images to be used by the HTML <img> tag
            { from: 'src/assets/images', to: 'assets/images' }
        ]
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};