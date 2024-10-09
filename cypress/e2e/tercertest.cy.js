describe('Prueba de Regresión: Actualización de Perfil', () => {
  beforeEach(() => {
    cy.viewport(1400, 925);
    cy.visit('http://localhost:5173/login');

    cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');

    cy.get('input[type="password"]').type('hash1');

    cy.get('button').contains('Iniciar Sesión').should('be.visible').click();



    cy.url().should('include', '/sessions');

    cy.visit('http://localhost:5173/profile');

    cy.url().should('include', '/profile');
    cy.wait(2000); // Espera para asegurar la carga completa de la página
  });


  it('Debería mostrar la página de perfil correctamente', () => {
    cy.url().should('include', '/profile');
  });

});
