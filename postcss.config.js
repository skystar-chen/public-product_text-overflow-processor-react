module.exports = {
  plugins: [
    require('postcss-preset-env')({
      browsers: 'last 2 versions', // 或通过 browserslist 配置
    }),
  ],
};
