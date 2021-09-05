const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const package = require('./package.json')

const isProduction =
  process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production'
const sourcePath = path.join(__dirname, './src')
const outPath = path.join(__dirname, './docs')

module.exports = {
  context: sourcePath,
  entry: {
    app: './main.tsx'
  },
  output: {
    path: outPath,
    filename: isProduction ? '[contenthash].js' : '[hash].js',
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    mainFields: ['module', 'browser', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] }
          },
          {
            loader: 'ts-loader'
          }
        ].filter(Boolean)
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      { test: /\.html$/, use: 'html-loader' }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      },
      meta: {
        title: package.name,
        description: package.description,
        keywords: Array.isArray(package.keywords)
          ? package.keywords.join(',')
          : undefined
      }
    })
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal',
    clientLogLevel: 'warning'
  },
  devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map'
}
