/// <reference types="cypress" />

const fixWhereAmI = require('../../fixtures/where_am_i.json')
const fixWeatherCurrent = require('../../fixtures/weather_current.json')
const fixRandomQuote = require('../../fixtures/random_quote.json')

describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.apiMocksSetup()
    cy.visit('/')
  })

  it('contains blog posts', () => {
    cy.get('.blogs-container').should('exist')
    cy.get('.blog-post').should('have.length.at.least', 1)
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

  it('displays correct header title and subtitle', () => {
    cy.contains('h2', 'Work in constant progress 👨🏼‍💻🛠')
      .should('exist')
      .and('be.visible')
    cy.contains('h3', 'A personal tech sandbox')
      .should('exist')
      .and('be.visible')
  })

  it('displays weather and location icons', () => {
    // Wait for the API calls to complete
    cy.wait('@whereAmI')
    cy.wait('@weatherCurrent')

    // First check that we have the weather and location card
    cy.get('.v-card').should('exist')

    // Check for the weather section
    cy.get('.weather-current').should('exist')
    cy.get('.weather-header').should('exist')

    // Check for the icons with their exact classes
    cy.get('.mdi-weather-partly-cloudy').should('exist')
    cy.get('.mdi-calendar-clock').should('exist')

    // Check for the weather icons container
    cy.get('.weather-icons').should('exist')
    cy.get('.weather-icon-img').should('have.length.at.least', 1)
  })

  it('displays blog posts with correct structure', () => {
    cy.get('.blogs-container').within(() => {
      cy.get('.blog-post').should('have.length.at.least', 1)
      cy.get('.blog-post')
        .first()
        .within(() => {
          cy.get('.text-h5').should('exist') // Blog title
          cy.get('.blog-content').should('exist') // Blog content
          cy.get('.action-buttons').should('exist') // Action buttons
        })
    })
  })

  it('maintains responsive layout', () => {
    // Test mobile layout
    cy.viewport('iphone-6')
    cy.get('.v-card').should(
      'have.css',
      'box-shadow',
      'rgba(0, 0, 0, 0.25) 0px 4px 20px 0px'
    )
    cy.get('.v-card').should('have.css', 'margin', '0px 8px 16px')

    // Test desktop layout
    cy.viewport(1024, 768)
    cy.get('.side-panel-container').should('exist')
  })

  it('displays social media links in footer', () => {
    cy.get('.mdi-github').should('exist').and('be.visible')
    cy.get('.mdi-instagram').should('exist').and('be.visible')
    cy.get('.mdi-facebook').should('exist').and('be.visible')
  })
})
