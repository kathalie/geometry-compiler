const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for minification
  entry: './ts/main.ts', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle filename
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // Extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Apply ts-loader for .ts and .tsx files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
