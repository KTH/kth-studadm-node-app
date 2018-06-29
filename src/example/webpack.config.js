// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const webpack = require('webpack')
const path = require('path')
const WebpackAssetsManifest = require('webpack-assets-manifest');

const prodMode = process.env.NODE_ENV === 'production'
const mode = prodMode ? 'production' : 'development'

const prodPlugins = [
  new webpack.DefinePlugin({
    "dev:module": "dist/index.dev.esm.js",
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new WebpackAssetsManifest()
]

const prodAlias = {}

const devPlugins = [
  new webpack.DefinePlugin({
    "dev:module": "dist/index.dev.esm.js"
  }),
  new WebpackAssetsManifest()
]

const devAlias = {
  inferno: path.join(process.cwd(), 'node_modules/inferno/dist/index.dev.esm.js')
}

const devFileName = '[name].bundle.js'
const prodFileName = '[name].[chunkhash].bundle.min.js'

module.exports = {
  mode,
  output: {
    filename: prodMode ? prodFileName : devFileName,
    path: path.join(process.cwd(), 'dist', 'public')
  },

  entry: {
    app: './src/example/client.tsx',
    vendor: './src/example/vendor.js'
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: prodMode ? prodAlias : devAlias
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        loader: 'awesome-typescript-loader?configFileName=src/example/tsconfig.client.json&transpileOnly=true'
      }
    ]
  },
  plugins: prodMode ? prodPlugins : devPlugins
}
