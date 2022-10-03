module.exports = {
  outputDir: '/home/serj/www/serj-tubin-com',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Srđan Tubin [Personal Tech Sandbox and Utility]'
        return args
      })
  }
}
