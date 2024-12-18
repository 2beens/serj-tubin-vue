const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // URL used as prefix for cy.visit() or cy.request() command's URL.
    baseUrl: 'http://localhost:8080',
  },
})
