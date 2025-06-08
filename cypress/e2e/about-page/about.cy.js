/// <reference types="cypress" />

describe('About Page Tests', () => {
  beforeEach(() => {
    cy.apiMocksSetup()
    cy.visit('/about')
  })

  it('displays main content sections', () => {
    // Check for main sections using more reliable selectors
    cy.get('main').should('exist')
    cy.get('h2').should('exist')
    cy.get('h3').should('exist')
    cy.get('h4').should('exist')
    cy.get('h5').should('exist')
  })

  it('displays personal information', () => {
    cy.get('#my-image').should('exist').and('be.visible')
    cy.get('h5').first().should('exist').and('be.visible')
  })

  it('displays GitHub links', () => {
    cy.contains('a', 'github.com/2beens/serj-tubin-com')
      .should('exist')
      .and('be.visible')
    cy.contains('a', 'github.com/2beens/rust-url-shortener')
      .should('exist')
      .and('be.visible')
    cy.contains('a', 'github.com/2beens/serj-tubin-vue')
      .should('exist')
      .and('be.visible')
  })

  it('displays location information', () => {
    cy.contains('h3', 'Frontend is served from 🇫🇮')
      .should('exist')
      .and('be.visible')
    cy.contains('h3', 'Backend lives in 🇫🇮 and 🇩🇪')
      .should('exist')
      .and('be.visible')
  })

  it('displays footer with version information', () => {
    // Wait for the API call to complete
    cy.wait('@getVersion')
    cy.get('#version-info')
      .should('exist')
      .and('be.visible')
      .and('contain', 'v1')
  })

  it('maintains consistent navigation bar', () => {
    cy.get('#main-menu-bar').then((el) => {
      expect(el).to.contain('Home')
      expect(el).to.contain('About')
      expect(el).to.contain('Visitor Board')
      expect(el).to.contain('Util')
      expect(el).to.contain('Netlog 🕸')
      expect(el).to.contain('SumUp')
    })
  })
})
