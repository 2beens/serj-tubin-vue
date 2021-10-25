module.exports = {
  outputDir: '/var/www/serj-tubin-vue',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Srđan Tubin [Personal Tech Sandbox and Utility]'
        return args
      })
  }
}
