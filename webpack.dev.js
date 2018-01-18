const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  output: {
    filename: "coinjs.js",
  },
  devtool: 'inline-source-map',
})
