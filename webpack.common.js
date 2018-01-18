const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'coinjs',
    libraryTarget: "umd"
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }],
  },

  externals: {
    'socket.io-client': {
      commonjs: 'socket.io-client',
      commonjs2: 'socket.io-client',
      amd: 'socket.io-client',
      root: 'io'
    },
    'sockjs-client': {
      commonjs: 'sockjs-client',
      commonjs2: 'sockjs-client',
      amd: 'sockjs-client',
      root: 'SockJS'
    }
  }
};
