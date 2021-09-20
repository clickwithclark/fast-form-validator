const path = require('path');

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
};
