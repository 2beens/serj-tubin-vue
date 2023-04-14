/// <reference types="cypress" />

describe('Home Page Tests', () => {
  const testIp = '1.1.1.1'

  beforeEach(() => {
    cy.apiMocksSetup()

    cy.intercept('GET', `${Cypress.config('apiEndpoint')}/myip`, testIp).as('loginApiCall')

    cy.visit('/util')
  })

  it('should display the util page [not logged in]', () => {
    cy.acceptCookies()
    cy.get('#user-agent-value').should('be.visible').and('not.be.empty')
    cy.get('#ip-addr-value').should('be.visible').and('contain', testIp)
    cy.get('#n8n-link').should('not.exist')
    cy.get('#files-box-container').should('not.exist')
  })

  it('should display the util page [logged in]', () => {
    cy.acceptCookies()
    cy.login()
    cy.get('#user-agent-value').should('be.visible').and('not.be.empty')
    cy.get('#ip-addr-value').should('be.visible').and('contain', testIp)
    cy.get('#n8n-link').should('exist').and('be.visible')
    cy.get('#files-box-container').should('exist')

    // TODO: test file box contents

  })
})
