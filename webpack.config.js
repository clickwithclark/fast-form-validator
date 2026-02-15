const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    
    output: {
      filename: isProduction ? 'ffv.min.js' : 'ffv.js',
      path: path.resolve(__dirname, 'UMD'),
      library: {
        name: 'FFV',
        type: 'umd',
        export: 'FFV',
      },
      globalObject: 'this',
      clean: true, // Clean output directory before build
    },

    mode: isProduction ? 'production' : 'development',
    
    // Only watch in development
    watch: !isProduction,
    
    // Source maps
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              pure_funcs: isProduction ? ['console.log'] : [],
            },
            output: {
              comments: false,
            },
            mangle: {
              // Don't mangle class/function names for better debugging
              keep_classnames: true,
              keep_fnames: true,
            },
          },
          extractComments: false,
        }),
      ],
    },

    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 10000, // 10kb warning threshold
      maxAssetSize: 10000,
    },

    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    },
  };
};
