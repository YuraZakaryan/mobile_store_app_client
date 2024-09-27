describe('The Login page', () => {
  it('Render page', () => {
    cy.visit('/login');
  });
  it('login', () => {
    cy.visit('/login');
    cy.get('[data-cy="login"]').type('3aqaryan');
    cy.get('[data-cy="password"]').type('MESSImessi1?');
    cy.get('button[type=submit]').click();
    cy.location('pathname').should('equal', '/');
    cy.get('[data-cy="header-my-clubs"]').contains('Իմ Ակումբները');
    cy.get('[data-cy="header-timer-history"]').contains('Պատմություն');
  });
});
