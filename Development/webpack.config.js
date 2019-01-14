const Path = require('path')

module.exports = {
  mode: 'development',
  entry: Path.resolve(__dirname, '../Core/Sources/index.js'),
  output: {
    filename: 'client-core.js',
    path: Path.resolve(__dirname, './Stage')
  }
}
