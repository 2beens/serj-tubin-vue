// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// configs
Cypress.config('apiEndpoint', 'http://localhost:9000')
Cypress.config('fileBoxEndpoint', 'http://localhost:1987')
Cypress.config('viewportHeight', 800)
Cypress.config('viewportWidth', 1600)

// Alternatively you can use CommonJS syntax:
// require('./commands')
