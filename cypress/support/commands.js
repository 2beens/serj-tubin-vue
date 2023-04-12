// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const fixWhereAmI = require("../fixtures/where_am_i.json")
const fixWeatherCurrent = require("../fixtures/weather_current.json")
const fixWeatherTomorrow = require("../fixtures/weather_tomorrow.json")
const fixRandomQuote = require("../fixtures/random_quote.json")
const fixBlogPosts = require("../fixtures/blog_posts.json")

Cypress.Commands.add('apiMocksSetup', () => {
  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/version`, 'v1').as('getVersion')
  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/whereami`, fixWhereAmI).as('whereAmI')
  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/weather/current`, fixWeatherCurrent).as('weatherCurrent')
  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/weather/tomorrow`, fixWeatherTomorrow).as('weatherTomorrow')
  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/quote/random`, fixRandomQuote).as('randomQuote')
  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/blog/page/1/size/20`, fixBlogPosts).as('blogPosts')
})
