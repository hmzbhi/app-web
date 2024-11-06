/* eslint-disable no-undef */
const backend = 'https://appweb.osc-fr1.scalingo.io'

describe('Home view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
    cy.intercept('POST', backend + '/login', { fixture: 'login2.json' }).as('login')
    cy.intercept('GET', backend + '/api/groupsmember', { fixture: 'groupsmember.json' }).as('groupsmember')
    cy.intercept('GET', backend + '/api/mygroups', { fixture: 'mygroups.json' }).as('mygroups')

    cy.get('.login-field').within(() => {    

      cy.get('input[type="text"]').type('NouvelUtilisateur@example.com')
      cy.get('input[type="password"]').type('MotDePasseFort123!')

      cy.get('button').click()
      cy.wait('@login')
    })

    cy.wait('@groupsmember')
    cy.wait('@mygroups')
  });

  it('Sebastien peut lister les groupes et en créer un', () => {
    cy.intercept('GET', backend + '/api/groupsmember', { fixture: 'groupsmember2.json' }).as('groupsmember2')
    cy.intercept('GET', backend + '/api/mygroups', { fixture: 'mygroups2.json' }).as('mygroups2')
    cy.intercept('POST', backend + '/api/mygroups', { fixture: 'newgroups.json' }).as('newgroup')

    cy.get('.list-groups').should('contain', 'groupe')
    cy.get('.groups-admin').should('contain', 'groupe')

    cy.get('input[type="text"][placeholder="nom du nouveau groupe"]').type('newgroup')
    cy.contains('button', 'Créer').click()

    cy.wait('@newgroup')

    cy.wait('@groupsmember2')
    cy.wait('@mygroups2')

    cy.get('.list-groups').should('contain', 'groupe')
    cy.get('.list-groups').should('contain', 'newgroup')
    
    cy.get('.groups-admin').should('contain', 'groupe')
    cy.get('.groups-admin').should('contain', 'newgroup')
  });
  
  it('Sebastien peut ajouter et supprimer un membre', () => {
    cy.intercept('GET', backend + '/api/users', { fixture: 'users.json' }).as('users')
    cy.intercept('GET', backend + '/api/mygroups/1', { fixture: 'members.json' }).as('members')
    cy.intercept('DELETE', backend + '/api/mygroups/1/1', { fixture: 'deletemember.json' }).as('deletemember')
    cy.intercept('PUT', backend + '/api/mygroups/1/1', { fixture: 'addmember.json' }).as('addmember')
    
    cy.get('.groups-admin').find('li').contains('groupe').click()
    cy.get('legend').should('contain', ' Administration groupe')
  
    cy.wait('@users')
    cy.wait('@members')

    cy.get('ul.list-members').find('li').should('have.length', 2)

    cy.intercept('GET', backend + '/api/mygroups/1', { fixture: 'members2.json' }).as('members2')

    cy.get('ul.list-members').contains('li', 'test@hamza.fr').find('button').click();
    
    cy.wait('@deletemember')
    cy.wait('@members2')

    cy.get('fieldset[id="on-left"]').should('contain', 'Membre supprimé')
    cy.get('ul.list-members').find('li').should('have.length', 1)

    cy.get('fieldset#on-left select').select('test@hamza.fr')
    
    cy.intercept('GET', backend + '/api/mygroups/1', { fixture: 'members.json' }).as('membersAferAdd')
    cy.get('fieldset#on-left button').contains('Ajouter').click()

    cy.wait('@addmember')
    cy.wait('@membersAferAdd')

    cy.get('fieldset[id="on-left"]').should('contain', 'Membre ajouté')
    cy.get('ul.list-members').find('li').should('have.length', 2)

    // A Faire: tester deux fois d'ajoouter le même membre...

  });
});