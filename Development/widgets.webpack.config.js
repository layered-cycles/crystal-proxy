const Path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: Path.resolve(__dirname, '../Widgets/Sources/Main/index.js'),
    image: Path.resolve(__dirname, '../Widgets/Sources/NoImage.js'),
    loader: Path.resolve(__dirname, '../Widgets/Sources/Loader.js')
  },
  output: {
    filename: '[name].widget.js',
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
