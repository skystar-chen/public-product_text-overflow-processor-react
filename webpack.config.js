// react-cat/webpack.config.js
const path = require('path');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

//创建一个插件的实例
// const htmlPlugin = new HtmlWebPackPlugin({
//   template: path.join(__dirname,'./public/index.html'), // 源文件
//   filename:'index.html', // 生成内存中的首页名称
// });

module.exports = {
  mode: 'production', // development/production

  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    }
  },
  
  entry: {
    index: './src/index.tsx',
  },

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, "lib"),
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      { 
        test: /\.css|.s[ac]ss$/, 
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /(\.js(x?))|(\.ts(x?))$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
          {loader: 'ts-loader'},
        ],
        exclude: /node_modules/,
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias:{
      '@': path.resolve(__dirname, '../src'), // @符号表示src这一层路径
    }, 
  },

  plugins: [
    // htmlPlugin,
    new CleanWebpackPlugin(['lib']),
  ],
}
