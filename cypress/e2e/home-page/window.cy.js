/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.apiMocksSetup()
    cy.visit('/')
  })

  it('cy.window() - get the global window object', () => {
    // https://on.cypress.io/window
    cy.window().should('have.property', 'top')
  })

  it('cy.document() - get the document object', () => {
    // https://on.cypress.io/document
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('cy.title() - get the title', () => {
    // https://on.cypress.io/title
    cy.title().should(
      'include',
      'Srđan Tubin [Personal Tech Sandbox and Utility]'
    )
  })
})
