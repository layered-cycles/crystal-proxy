const Path = require('path')

module.exports = {
  mode: 'production',
  entry: Path.resolve(__dirname, '../ProxyCore/Sources/index.js'),
  output: {
    filename: 'proxy-core.js',
    path: Path.resolve(__dirname, './Stage')
  }
}
