module.exports = (isDev) => {
  return {
    preserveWhiteSpace: true, // 处理HTML中的空格
    extractCSS: !isDev, // 能将所有的css打包一个文件中
    hotReload: isDev // 组件热加载，根据环境变量生成
  }
}
