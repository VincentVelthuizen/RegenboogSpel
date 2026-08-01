const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    rainbow: './js/app.js',
    dots: './js/dots/app.js',
    yahtzee: './js/yahtzee/app.js',
    sudoku: './js/sudoku/app.js',
    woordzoeker: './js/woordzoeker/app.js',
    jumbolino: './js/jumbolino/app.js',
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
    // Sudoku.
    new HtmlWebpackPlugin({
      template: './sudoku.html',
      filename: 'sudoku.html',
      chunks: ['sudoku'],
    }),
    // Woordzoeker.
    new HtmlWebpackPlugin({
      template: './woordzoeker.html',
      filename: 'woordzoeker.html',
      chunks: ['woordzoeker'],
    }),
    // Jumbolino (babyshower dice game).
    new HtmlWebpackPlugin({
      template: './jumbolino.html',
      filename: 'jumbolino.html',
      chunks: ['jumbolino'],
    }),
    // Babyshower hub menu — pure HTML/CSS, no bundle injected.
    new HtmlWebpackPlugin({
      template: './babyshower.html',
      filename: 'babyshower.html',
      inject: false,
    }),
  ],
};
