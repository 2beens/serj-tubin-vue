const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    // URL used as prefix for cy.visit() or cy.request() command's URL.
    baseUrl: 'http://localhost:8080'
  }
})
