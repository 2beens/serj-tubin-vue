/// <reference types="cypress" />

const fixWhereAmI = require('../../fixtures/where_am_i.json')
const fixWeatherCurrent = require('../../fixtures/weather_current.json')
const fixRandomQuote = require('../../fixtures/random_quote.json')

describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.apiMocksSetup()
    cy.visit('/')
  })

  it('contains 4 blog posts', () => {
    cy.get('#blogs-list').children().should('have.length', 5) // 4 blogs + 1 footer
  })

  it('displays main photo', () => {
    cy.get('#my-image').should('exist')
  })

  it('app bar shows correct buttons when not logged in', () => {
    cy.get('#login-button').should('exist').and('be.visible')
    cy.get('#logout-button').should('not.exist')
    cy.get('#main-menu-bar').then((el) => {
      expect(el).to.contain('Home')
      expect(el).to.contain('About')
      expect(el).to.contain('Visitor Board')
      expect(el).to.contain('Util')
      expect(el).to.contain('Netlog 🕸')
      expect(el).to.contain('SumUp')
    })
  })

  it('displays version', () => {
    cy.get('#version-info')
      .should('exist')
      .and('be.visible')
      .and('contain', 'v1')
  })

  it('display quote', () => {
    cy.get('.quote-text', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .and('contain', fixRandomQuote.text)
  })

  it('display weather', () => {
    cy.get('.location-value', { timeout: 10000 })
      .should('exist')
      .then((el) => {
        expect(el.text()).to.contain(fixWhereAmI.city)
        expect(el.text()).to.contain(fixWhereAmI.country)
      })

    cy.get('.weather-value', { timeout: 10000 })
      .should('exist')
      .and('contain', fixWeatherCurrent[0].description)

    cy.get('.weather-icons').should('exist').and('not.be.empty')
  })

  it('home page consent banner', () => {
    cy.getCookie('cookieconsent_status').then((cookie) => {
      // consent cookie at the start not there
      expect(cookie).to.be.null
    })

    cy.getAllCookies().should('be.empty')
    cy.get('#consent-div').should('exist').and('be.visible')
    cy.get('#cookies-ok-btn').should('exist')

    cy.get('#cookies-ok-btn').click()

    // banner gone after consent button clicked, and cookie set
    cy.get('#consent-div').should('not.be.visible')
    cy.getCookie('cookieconsent_status').then((cookie) => {
      expect(cookie).to.exist
    })

    // 2 Google Analytics + 1 cookies banner = 3 cookies in total
    cy.getAllCookies().should('have.length', 3)
  })
})
