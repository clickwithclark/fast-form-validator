const path = require('path');

module.exports = {
    entry: ['./index.js'],
    output: {
      filename: 'ffv.min.js',
      path: path.resolve(__dirname, 'UMD'),
     
    library: {
      type: 'umd',
      name: 'FFV',
    },
    // prevent error: `Uncaught ReferenceError: self is not define`
    // globalObject: 'this',
    },
    mode: 'production',

  };
  