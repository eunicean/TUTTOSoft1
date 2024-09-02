describe('Prueba de Funcionalidad: Actualización de Perfil', () => {
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

  it('Debería permitir cerrar la sesión desde la barra lateral', () => {
    cy.get('.menu-toggle').click();
    cy.get('li').contains('Cerrar Sesión').click({ force: true });
    cy.url().should('include', '/login');
  });
});
