/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:17:20
* @Last Modified by:   Craig Bojko (c14486a)
* @Last Modified time: 2016-12-13 15:18:50
*/

require('colors')
console.log('WEBPACK DEV SERVER.'.magenta)

var express = require('express')
var httpProxy = require('http-proxy')
var Webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackConfig = require('./webpack.config')
var proxy = httpProxy.createProxyServer()
var app = express()

var bundleStart = null
var compiler = Webpack(webpackConfig)

compiler.plugin('compile', function () {
  console.log('Bundling...'.cyan)
  bundleStart = Date.now()
})
compiler.plugin('done', function () {
  console.log('Bundled in '.cyan + (Date.now() - bundleStart) + 'ms!'.cyan)
})

var bundler = new WebpackDevServer(compiler, {
  // We need to tell Webpack to serve our bundled application
  // from the build path. When proxying:
  // http://localhost:3000/build -> http://localhost:8080/build
  publicPath: '/build/dev/',
  quiet: false,
  noInfo: false,
  clientLogLevel: 'info',
  stats: {
    colors: true,
    progress: true,
    timings: true,
    hash: true
  }
})

bundler.listen(8080, 'localhost', function () {
  console.log('Bundling project, please wait...'.cyan)
})

app.all('/build/dev/*', function (req, res) {
  console.log('PROXYING REQUEST...'.cyan)
  proxy.web(req, res, {
    target: 'http://localhost:8080'
  })
})

proxy.on('error', function (e) {
  console.log('Could not connect to proxy, please try again...'.red)
})

app.set('port', 1337)
app.use('/', express.static('./test'))

app.listen(1337, function () {
  console.log('Server running on port '.magenta + 1337)
})
