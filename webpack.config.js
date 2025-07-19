const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  // Define entry points for each page
  entry: {
    main: './src/js/main.js',
    login: './src/js/login.js',
    register: './src/js/register.js',
    slideshow: './src/js/slideshow.js',
    auth: './src/js/auth.js',
    // Note: appwrite.js is loaded via CDN in the HTML
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
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
    
    // Create an HTML file for each page
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
      chunks: [], // No specific JS needed for this page
    }),

    // Copy static assets that are not directly imported
    new CopyWebpackPlugin({
        patterns: [
            { from: 'src/assets', to: 'assets' }
        ]
    })
  ],
  devServer: {
    static: './dist',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};