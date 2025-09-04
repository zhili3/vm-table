const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  transpileDependencies: true,
  // lintOnSave: false,
  configureWebpack: {
    // 以便在webpack的名称字段中提供应用程序的标题，以便
    //可以在index.html中访问它以注入正确的标题。
    resolve: {
      alias: {
        "@axamples": path.resolve(__dirname, 'examples'),
        "@packages": path.resolve(__dirname, 'packages'),
        "utils": path.resolve(__dirname, 'src/utils'),
      },
    },
  },
})
