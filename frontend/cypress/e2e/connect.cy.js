/* eslint-disable no-undef */
const backend = 'https://appweb.osc-fr1.scalingo.io'
describe('Scenario de test', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/')
  })

  it('A new user is registering correctly', () => {
    cy.intercept('POST', backend + '/register', { fixture: 'registered.json' }).as('register')
    
    cy.get('.register-field').within(() => {
      
      cy.contains('Le login est incorrect.')
      cy.contains('Mot de passe faible.')
      
      cy.get('input[type="text"]').eq(0).type('NouvelUtilisateur')
      cy.get('input[type="text"]').eq(1).type('NouvelUtilisateur@example.com')
      cy.should('not.contain', 'Le login est incorrect.')

      cy.get('input[type="password"]').eq(0).type('MotDePasseFort123!')
      cy.should('not.contain', 'Mot de passe faible.')
      cy.contains('Les mots de passe ne correspondent pas.')
      
      cy.get('input[type="password"]').eq(1).type('MotDePasseFort123!')
      cy.should('not.contain', 'Les mots de passe ne correspondent pas.')

      cy.get('button').click()
      cy.wait('@register')
      cy.contains('Enrigistrement effectué')
    })

    cy.get('.login-field input[type="text"]').should('have.value', 'NouvelUtilisateur@example.com')
  })

  it('A registered user try to register again', () => {
    cy.intercept('POST', backend + '/register', { fixture: 'failedRegister.json' }).as('register')
    
    cy.get('.register-field').within(() => {

      cy.get('input[type="text"]').eq(0).type('NouvelUtilisateur')
      cy.get('input[type="text"]').eq(1).type('NouvelUtilisateur@example.com')

      cy.get('input[type="password"]').eq(0).type('MotDePasseFort123!')
      cy.get('input[type="password"]').eq(1).type('MotDePasseFort123!')

      cy.get('button').click()
      cy.wait('@register')
      cy.contains('Erreur lors de l\'enregistrement')
    })
  })

  it('Tente de se connecter avec des informations incorrectes', () => {
    cy.intercept('POST', backend + '/login', { fixture: 'failedLogin.json' }).as('login')
    
    cy.get('.login-field').within(() => {
      
      cy.contains('Le login est incorrect.')
      cy.contains('Mot de passe trop court.')
      
      cy.get('input[type="text"]').type('NouvelUtilisateur@example.com')
      cy.should('not.contain', 'Le login est incorrect.')

      cy.get('input[type="password"]').type('MotDePasseInvalid')
      cy.should('not.contain', 'Mot de passe trop court.')

      cy.get('button').click()
      cy.wait('@login')
      cy.contains('Email/Mot de passe incorrect.')
    })
  })

  it('Se connecte avec des informations correctes', () => {
    cy.intercept('POST', backend + '/login', { fixture: 'login.json' }).as('login')
    
    cy.get('.login-field').within(() => {    

      cy.get('input[type="text"]').type('NouvelUtilisateur@example.com')
      cy.get('input[type="password"]').type('MotDePasseFort123!')

      cy.get('button').click()
      cy.wait('@login')
    })

    cy.contains('Re-Bonjour NouvelUtilisateur')
  })
})