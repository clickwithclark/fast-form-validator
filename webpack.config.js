const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'ffv.min.js',
    path: path.resolve(__dirname, 'UMD'),

    library: {
      type: 'umd',
    },
    // prevent error: `Uncaught ReferenceError: self is not defined`
    globalObject: 'this',
  },
  mode: 'production',
  // mode: 'development',
  watch: true,
  // devtool:'hidden-cheap-module-source-map'
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       terserOptions: {
  //         keep_classnames: true,
  //         keep_fnames: true,
  //       },
  //     }),
  //   ],
  // },
};
