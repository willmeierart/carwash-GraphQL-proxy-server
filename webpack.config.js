const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  externals: [webpackNodeExternals()],
  module: {
    rules: [
      {
        // only run on js:
        test: /\.js?$/,
        loader: 'babel-loader',
        //also a regex:
        exclude: /node_modules/,
        options: {
          presets: [
            // for async:
            'stage-0',
            // env is master preset for transpiling rules
            ['env', { targets: { "node": "current" } }]
          ]
        }
      }
    ]
  }
}
