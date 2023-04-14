/// <reference types="cypress" />

describe('Home Page Tests', () => {
  const testIp = '1.1.1.1'

  beforeEach(() => {
    cy.apiMocksSetup()
    cy.fileBoxMockSetup()
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
    cy.get('#files-box-container').should('exist').and('be.visible')

    cy.get('.v-treeview-node').should('have.length', 7)
    cy.get('.mdi-folder').should('have.length', 6)
    cy.get('.mdi-lock').should('have.length', 1)
    cy.get('.mdi-file-image').should('have.length', 1)

    // open the first folder "books"
    cy.get('#file-1432535').should('not.exist')
    cy.get('.v-icon--link.mdi.mdi-menu-down').first().click()
    cy.get('#file-1432535').children().first().contains('System Design Interview.pdf')
  })
})
