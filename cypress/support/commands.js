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

Cypress.Commands.add('apiMocksSetup', () => {
  const fixWhereAmI = require('../fixtures/where_am_i.json')
  const fixWeatherCurrent = require('../fixtures/weather_current.json')
  const fixWeatherTomorrow = require('../fixtures/weather_tomorrow.json')
  const fixRandomQuote = require('../fixtures/random_quote.json')
  const fixBlogPosts = require('../fixtures/blog_posts.json')

  cy.intercept('GET', `${Cypress.config('apiEndpoint')}/version`, 'v1').as(
    'getVersion'
  )
  cy.intercept(
    'GET',
    `${Cypress.config('apiEndpoint')}/whereami`,
    fixWhereAmI
  ).as('whereAmI')
  cy.intercept(
    'GET',
    `${Cypress.config('apiEndpoint')}/weather/current`,
    fixWeatherCurrent
  ).as('weatherCurrent')
  cy.intercept(
    'GET',
    `${Cypress.config('apiEndpoint')}/weather/tomorrow`,
    fixWeatherTomorrow
  ).as('weatherTomorrow')
  cy.intercept(
    'GET',
    `${Cypress.config('apiEndpoint')}/quote/random`,
    fixRandomQuote
  ).as('randomQuote')
  cy.intercept(
    'GET',
    `${Cypress.config('apiEndpoint')}/blog/page/1/size/20`,
    fixBlogPosts
  ).as('blogPosts')
})

Cypress.Commands.add('fileBoxMockSetup', () => {
  const fixFileBox = require('../fixtures/file-box-root.json')
  cy.intercept(
    'GET',
    `${Cypress.config('fileBoxEndpoint')}/f/root`,
    fixFileBox
  ).as('fileBox')
})

Cypress.Commands.add('login', () => {
  const sessionToken = '1234567890'
  const loginResponse = `{"token": "${sessionToken}"}`
  cy.intercept(
    'POST',
    `${Cypress.config('apiEndpoint')}/a/login`,
    loginResponse
  ).as('loginApiCall')

  cy.get('#login-button').click()
  cy.get('#login-form-username').type('user1')
  cy.get('#login-form-password').type('password1')
  cy.contains('button', 'Login!').click()
})

Cypress.Commands.add('acceptCookies', () => {
  cy.get('#cookies-ok-btn').click()
})
