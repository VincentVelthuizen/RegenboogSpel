const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    rainbow: './js/app.js',
    dots: './js/dots/app.js',
    yahtzee: './js/yahtzee/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'js/[name].js',
  },
  plugins: [
    // Landing menu — pure HTML/CSS, no bundle injected.
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: false,
    }),
    // Regenboogspel.
    new HtmlWebpackPlugin({
      template: './regenboog.html',
      filename: 'regenboog.html',
      chunks: ['rainbow'],
    }),
    // Stippenspel (connect-the-dots).
    new HtmlWebpackPlugin({
      template: './stippen.html',
      filename: 'stippen.html',
      chunks: ['dots'],
    }),
    // Yahtzee.
    new HtmlWebpackPlugin({
      template: './yahtzee.html',
      filename: 'yahtzee.html',
      chunks: ['yahtzee'],
    }),
  ],
};
