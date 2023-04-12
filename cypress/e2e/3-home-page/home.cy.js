/// <reference types="cypress" />

const fixWhereAmI = require('../../fixtures/where_am_i')
const fixWeatherCurrent = require('../../fixtures/weather_current')
const fixWeatherTomorrow = require('../../fixtures/weather_tomorrow')
const fixRandomQuote = require('../../fixtures/random_quote')
const fixBlogPosts = require('../../fixtures/blog_posts')

describe('example to-do app', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/version`, 'v1').as('getVersion')
    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/whereami`, fixWhereAmI).as('whereAmI')
    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/weather/current`, fixWeatherCurrent).as('weatherCurrent')
    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/weather/tomorrow`, fixWeatherTomorrow).as('weatherTomorrow')
    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/quote/random`, fixRandomQuote).as('randomQuote')
    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/blog/page/1/size/20`, fixBlogPosts).as('blogPosts')
    cy.visit('/')
  })

  it('displays main photo', () => {
    cy.get('#my-image').should('exist')
  })

  it('app bar shows correct buttons', () => {
    cy.get('#login-button').should('exist').and('be.visible')
    cy.get('#logout-button').should('not.exist')
    cy.get('#main-menu-bar').then((el) => {
      expect(el).to.contain('Home')
      expect(el).to.contain('About')
      expect(el).to.contain('Visitor Board')
      expect(el).to.contain('Util')
      expect(el).to.contain('Netlog 🕸')
    })
  })

  it('displays version', () => {
    cy.get('#version-info').
      should('exist').
      and('be.visible').
      and('contain', 'v1')
  })

  it('display quote', () => {
    cy.get('#quote-text').
      should('exist').
      and('be.visible').
      and('contain', fixRandomQuote.text)
  })

  it('display weather', () => {
    cy.get('#geo-city').then((el) => {
      expect(el).to.contain(fixWhereAmI.city)
      expect(el).to.contain(fixWhereAmI.country)
    })
    cy.get('#weather-now').should('contain', fixWeatherCurrent[0].description)
    cy.get('#weather-tomorrow').should('not.be.empty')
  })

  it('home page consent banner', () => {
    cy.getCookie('cookieconsent_status').then((cookie) => {
      // consent cookie at the start not there
      expect(cookie).to.be.null
    })

    cy.get('#consent-div').should('exist').and('be.visible')
    cy.get('#cookies-ok-btn').should('exist')

    cy.get('#cookies-ok-btn').click()

    // banner gone after consent buton clicked, and cookie set
    cy.get('#consent-div').should('not.be.visible')
    cy.getCookie('cookieconsent_status').then((cookie) => {
      expect(cookie).to.exist
    })
  })
})
