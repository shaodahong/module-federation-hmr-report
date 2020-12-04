const path = require('path');
// const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ModuleFederationPlugin = require('webpack').container
  .ModuleFederationPlugin;
const isDevelopment = process.env.NODE_ENV !== 'production';
const deps = require('./package.json').dependencies;

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    publicPath: 'http://127.0.0.1:3001/',
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3001,
    liveReload: false,
    injectClient: true,
    injectHot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    // isDevelopment && new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://127.0.0.1:3001/remoteEntry.js',
      },
      exposes: {
        './App': './src/App',
      },
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new MiniCssExtractPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
