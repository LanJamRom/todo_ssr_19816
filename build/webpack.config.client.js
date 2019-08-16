
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV === 'development'
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new VueLoaderPlugin(),
  new HTMLPlugin()
]
let config
const devServer = {
  // 开发环境端口
  port: 8080,
  host: '0.0.0.0',
  // 路由识别
  historyApiFallback: true,
  overlay: {
    errors: true
  },
  // 热加载，只渲染改变的组件，不需要重新渲染整个页面
  hot: true
}
if (isDev) {
  // 开发环境
  config = merge(baseConfig, {
    mode: 'development',
    // 页面调试工具
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        // css预处理器，使用模块化的方式写css代码
        // stylus-loader专门用来处理stylus文件，处理完成后变成css文件，交给css-loader.
        // webpack的loader就是这样一级一级向上传递，每一层loader只处理自己关心的部分
        {
          test: /\.styl/,
          oneOf: [
            // 这里匹配 `<style module>`
            {
              resourceQuery: /module/,
              use: [
                'vue-style-loader', // 使.vue文件中的css能热加载
                {
                  loader: 'css-loader',
                  options: {
                    // 开启 CSS Modules
                    modules: true,
                    camelCase: true, // 将 - 连接的类名转化为camelCase
                    // 自定义生成的类名
                    localIdentName: '[path]-[name]-[hash:base64:5]'
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true
                  }
                },
                'stylus-loader'
              ]
            },
            // 这里匹配普通的 `<style>` 或 `<style scoped>`
            {
              use: [
                'vue-style-loader', // 使.vue文件中的css能热加载
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true
                  }
                },
                'stylus-loader'
              ]
            }
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  // 生产环境
  config = merge(baseConfig, {
    mode: 'production',
    entry: {
      app: path.join(__dirname, '../client/index.js'),
      vendor: ['vue'] // 将所用到的类库单独打包
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: ExtractPlugin.extract({
                fallback: 'vue-style-loader',
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      // 开启 CSS Modules
                      modules: true,
                      camelCase: true,
                      // 自定义生成的类名
                      localIdentName: '[hash:base64:5]'
                    }
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      sourceMap: true
                    }
                  },
                  'stylus-loader'
                ]
              })
            },
            {
              use: ExtractPlugin.extract({
                fallback: 'vue-style-loader',
                use: [
                  'css-loader',
                  {
                    loader: 'postcss-loader',
                    options: {
                      sourceMap: true
                    }
                  },
                  'stylus-loader'
                ]
              })
            }
          ]
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[hash:8].css')
    ]),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      },
      runtimeChunk: true
    }
  })
}

module.exports = config
