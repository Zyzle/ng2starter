var webpack = require('webpack');

module.exports = {
  entry: "./app/bootstrap",
  output: {
    path: __dirname + "/lib", publicPath: 'lib/', filename: "bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [{
      test: /\.ts/, loaders: ['ts-loader'], exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ]
};
