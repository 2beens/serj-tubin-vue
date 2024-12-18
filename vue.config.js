module.exports = {
  outputDir: process.env.VUE_APP_OUTPUT_DIR,
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Srđan Tubin [Personal Tech Sandbox and Utility]'
      return args
    })
  },
}
