const {CheckerPlugin} = require('awesome-typescript-loader');
const {optimize, SourceMapDevToolPlugin} = require('webpack');
const {join} = require('path');
let prodPlugins = [];
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push(
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin(),
  );
}
module.exports = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry: {
    content: join(__dirname, 'src/scripts/content.ts'),
    background: join(__dirname, 'src/scripts/background.ts'),
    inject: join(__dirname, 'src/scripts/inject.ts')
  },
  output: {
    path: join(__dirname, 'dist/scripts'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}',
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new SourceMapDevToolPlugin({
      filename: '[name].js.map',
    }),
    ...prodPlugins,
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
