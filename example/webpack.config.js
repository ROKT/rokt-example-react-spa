const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin
const argv = require('yargs').argv
const dotenv = require('dotenv')
const envFile = dotenv.config({ path: path.join(__dirname, '.env') }).parsed;

const modes = {
  production: 'production',
  development: 'development',
}

let mode = modes.development

if (argv.mode === modes.production) {
  mode = modes.production
  process.env.NODE_ENV = modes.production
}

const ENTRY_NAME = 'index'
const __outdir = [__dirname, 'build']

if (fs.existsSync(path.join(...__outdir))) {
  fs.rmSync(path.join(...__outdir), { recursive: true })
}

const config = {
  mode,
  devtool: 'source-map',
  entry:  {
    [ENTRY_NAME]: path.join(__dirname, 'src', 'index.jsx'),
  },
  output: {
    filename: '[name].js',
    path: path.join(...__outdir),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      filename: 'index.html',
      template: 'src/index.html',
      base: '/',
      templateParameters: { env: envFile },
    }),
    new DefinePlugin({
      'env': JSON.stringify(envFile)
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFields: ['module', 'main'],
    alias: {}
  },
  devServer: {
    contentBase: path.join(...__outdir),
    hot: false,
    disableHostCheck: true,
    port: 8888,
    historyApiFallback: true,
    writeToDisk: true,
    watchContentBase: true
  }
}

if (mode === modes.production) {
  config.output.filename = '[name].[chunkhash].js'
} else {
}

module.exports = config