const Path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    'main.loading': Path.resolve(
      __dirname,
      '../ClientComponents/Sources/Miscellaneous/MainLoading.js'
    ),
    'main.widget': Path.resolve(
      __dirname,
      '../ClientComponents/Sources/MainWidget/index.js'
    ),
    'noimage.display': Path.resolve(
      __dirname,
      '../ClientComponents/Sources/Miscellaneous/NoImage.js'
    )
  },
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, './Stage')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['url-loader']
      }
    ]
  }
}
