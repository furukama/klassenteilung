const path = require('path');

module.exports = {
  entry: './src/klassenteilung.js',
  output: {
    filename: 'klassenteilung.min.js',
    libraryTarget: 'window',
    library: 'partition',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
  },
};
