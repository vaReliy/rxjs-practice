const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'source-map',
  devServer: {
    port: 4202,
  },
  plugins: [
    new HTMLPlugin({
      template: './src/index.html',
    }),
  ],
};
