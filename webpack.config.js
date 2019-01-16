var path = require('path')
var webpack = require('webpack')
var copyWebpackPlugin = require('copy-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin')
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var now = +new Date;
// var AsyncModulePlugin = require('async-module-loader/plugin')
module.exports = {
  entry: {
    main : './src/main.js',
    login : './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      { test: /\.html$/,loader : 'html-loader',query : {minimize : false}},
      { test : /\.(jpg|png|gif)\??.*$/,loader:"url-loader",query:{limit : 1,name : "image/[name].[ext]"}},
      { test : /\.(woff|svg|eot|ttf)\??.*$/,loader:"url-loader",query:{limit : 1,name : "fonts/[name].[ext]"}}
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    port : 8090,
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    hot : false,
    inline : false
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
module.exports.plugins = [
  new CleanPlugin(['dist']),
  new CommonsChunkPlugin({
    chunks: ['main', 'login'],
    name: 'common'
  }),
  new copyWebpackPlugin([
    { from: './htmp.html',to : './htmp.html'},
    { from: './hmmp.html',to : './hmmp.html'},
    { from: './login.html',to : './login.html'},
    { from: './src/image',to : './image'}
  ])
];
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
