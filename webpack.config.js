const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  // Define an entry point for each page's main JavaScript file
  entry: {
    main: './src/js/main.js',
    login: './src/js/login.js',
    register: './src/js/register.js',
    slideshow: './src/js/slideshow.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    // This is the crucial addition: It makes all asset paths absolute.
    publicPath: '/',
    clean: true, // Clean the output directory before each build
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
    // Extract CSS into separate files
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
    }),
    
    // Create an HTML file for each page, injecting the correct JS bundle
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'], // Only include the 'main' javascript bundle
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
      chunks: [], // No specific JS needed for this page
    }),

    // Copy static assets that are referenced directly in HTML
    new CopyWebpackPlugin({
        patterns: [
            { from: 'src/assets', to: 'assets' }
        ]
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};