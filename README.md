## vue-loader
    直接在vue-loader里配置cssModules无效，必须在css-loader中modules为true
    
## css-loader
    要在某些模块单独使用module css模块，可以使用oneOf规则匹配module字符串
// webpack.config.js -> module.rules
{
    test: /\.css$/,
        oneOf: [
            // this matches `<style module>`
            {
              resourceQuery: /module/,
              use: [
                'vue-style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[local]_[hash:base64:5]'
                  }
                }
              ]
            },
            // this matches plain `<style>` or `<style scoped>`
            {
              use: [
                'vue-style-loader',
                'css-loader'
              ]
            }
        ]
}
