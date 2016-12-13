/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (c14486a)
* @Last Modified time: 2016-12-13 13:39:35
*/

import npmPackage from './package'
import path from 'path'
import webpack from 'webpack'
import LiveReloadPlugin from 'webpack-livereload-plugin'
import SmartBannerPlugin from 'smart-banner-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'

const __RFC_ID = npmPackage.rfc
const NODE_ENV = process.env.NODE_ENV
const isProd = (NODE_ENV === 'production')

const lessVarsDev = {
  'sourceMap': '',
  'modifyVars': {
    'ns': __RFC_ID
  }
}
const lessVarsProd = {
  'modifyVars': {
    'ns': __RFC_ID
  }
}

function getBuildBanner () {
  const npmPackage = require('./package')
  const date = new Date()
  let copy = ''
  copy += 'Author: ' + npmPackage.author + ' - Experian Consumer Services'
  copy += '\nFilename: [filename]'
  copy += '\nVersion: ' + npmPackage.version
  copy += '\nDate: ' + date.toISOString()
  copy += '\nDescription: ' + npmPackage.description
  console.log(copy)
  return copy
}

/**
 * webpack config defaults and base configuration
 * @type {Object}
 */
let wbConfig = {
  cache: true,
  entry: {
    main: path.join(__dirname, '/index.js')
  },
  output: {
    path: path.join(__dirname, '/build/'),
    filename: '[name].js',
    sourceMapFilename: '[name].map'
  },
  // watch: true,
  keepalive: true,
  debug: true,
  plugins: [
    new webpack.OldWatchingPlugin(),
    new SmartBannerPlugin(getBuildBanner(), { raw: false, entryOnly: true }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'underscore-template-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?presets[]=es2015'
      }
      // { test: /\.html$/, loader: 'html' },
      // { test: /\.css|less$/, loader: 'style-loader!css-loader!postcss-loader!less-loader' },
    ]
  },
  postcss: function () {
    return [precss, autoprefixer]
  },
  externals: {}
}

/**
 * Branches additional webpack options depending on Environmental build - see Makefile
 * @param  {boolean} !isProd - branch flag
 * @return {void}
 */
if (!isProd) { // DEVELOPMENT
  /**
   * Add source maps
   * Push live reload plugins
   * Push Uglify - keep debugger statements, do not mangle
   * Push Define - Common variables for build
   * Define Output as build/dev
   */
  wbConfig['devtool'] = 'inline-source-map'
  wbConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  wbConfig.plugins.push(new LiveReloadPlugin({
    appendScriptTag: true
  }))
  wbConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_debugger: false,
      warnings: false
    },
    mangle: false
  }))
  wbConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development'),
      'RFC_NAMESPACE': JSON.stringify(__RFC_ID)
    }
  }))
  wbConfig.module.loaders.push({ test: /\.css|less$/, loader: 'style!css?sourceMap!postcss-loader!less?' + JSON.stringify(lessVarsDev) })

  wbConfig.output = {
    path: path.join(__dirname, '/build/dev/'),
    filename: '[name].dev.js',
    sourceMapFilename: '[name].dev.map'
    // ## Add this to overwrite sourcemap URIs to absolute file paths
    // devtoolModuleFilenameTemplate: function (info) {
    //   return 'file://' + encodeURI(info.absoluteResourcePath)
    // }
  }
} else { // PRODUCTION
  /**
   * Push Uglify - drop debugger/console/comments statements, mangle code
   * Push Define - Common variables for build
   * Push Banner - defined in above function
   * Define Output as build/prod
   */
  wbConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_debugger: true,
      drop_console: true,
      warnings: false
    },
    output: {
      comments: false
    },
    mangle: true
  }))
  wbConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
      'RFC_NAMESPACE': JSON.stringify(__RFC_ID)
    }
  }))
  wbConfig.plugins.push(new SmartBannerPlugin(getBuildBanner(), { raw: false, entryOnly: true })) // put header back in after uglify strips out
  wbConfig.module.loaders.push({ test: /\.css|less$/, loader: 'style!css?sourceMap!postcss-loader!less?' + JSON.stringify(lessVarsProd) })

  wbConfig.output = {
    path: path.join(__dirname, '/build/prod/'),
    filename: '[name].min.js'
  }
}

/**
 * Export config
 * @type {object}
 */
export default wbConfig
