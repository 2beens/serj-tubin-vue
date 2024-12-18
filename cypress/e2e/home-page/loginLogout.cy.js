/// <reference types="cypress" />

describe('Ability to log in from the home page', () => {
  beforeEach(() => {
    cy.apiMocksSetup()
    cy.visit('/')
  })

  it('displays login form', () => {
    cy.get('#login-button').should('exist').and('be.visible')
    cy.get('#login-button').click()
    cy.get('#login-form').should('exist').and('be.visible')
    cy.get('#login-form-username').should('exist').and('be.visible')
    cy.get('#login-form-password').should('exist').and('be.visible')
    cy.get('#login-button').should('exist')
    cy.contains('button', 'Abort')
    cy.contains('button', 'Login!')

    // abort first time
    cy.contains('button', 'Abort').click()
    cy.get('#login-form-username').should('exist').and('not.be.visible')
    cy.get('#login-form-password').should('exist').and('not.be.visible')

    cy.get('#login-button').click()
    // nothing happens as the form is empty
    cy.get('#login-form-login-button').click()
    cy.get('#login-form').should('exist').and('be.visible')
    // set username only, and try clicking the login button
    cy.get('#login-form-username').type('user1')
    cy.get('#login-form').should('exist').and('be.visible')

    cy.get('#login-form-password').type('password1')
    cy.get('#login-form-login-button').should('exist').and('be.visible')
  })

  it('logs in and out properly', () => {
    const sessionToken = '1234567890'
    const loginResponse = `{"token": "${sessionToken}"}`
    const logoutResponse = 'logged-out'
    cy.intercept(
      'POST',
      `${Cypress.config('apiEndpoint')}/a/login`,
      loginResponse
    ).as('loginApiCall')
    cy.intercept(
      'GET',
      `${Cypress.config('apiEndpoint')}/a/logout`,
      logoutResponse
    ).as('logoutApiCall')

    cy.getCookie('sessionkolacic').should('not.exist')

    cy.get('#login-button').click()
    cy.get('#login-form-username').type('user1')
    cy.get('#login-form-password').type('password1')

    cy.getCookie('sessionkolacic').should('not.exist')
    cy.contains('button', 'Login!').click()

    // check the session cookie was added: sessionkolacic
    cy.getCookie('sessionkolacic').should('exist')
    cy.getCookie('sessionkolacic').then((cookie) => {
      expect(cookie.value).to.be.eq(sessionToken)
    })

    cy.get('#login-button').should('not.exist')
    cy.get('#logout-button').should('exist').and('be.visible')

    // try and assert logout now //////////
    cy.get('#logout-button').click()
    cy.get('#login-button').should('exist').and('be.visible')
    cy.get('#logout-button').should('not.exist')
    cy.getCookie('sessionkolacic').then((cookie) => {
      expect(cookie).to.be.null
    })
  })
})
