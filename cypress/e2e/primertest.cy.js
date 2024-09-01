describe('Prueba de Integración: Inicio de Sesión y Redirección a Sesiones', () => {
  it('Debería permitir iniciar sesión y redirigir a la página de sesiones', () => {
    // Visitar la página de login
    cy.visit('http://localhost:5173/login');

    // Introducir el correo electrónico y la contraseña
    cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
    cy.get('input[type="password"]').type('hash1');

    // Hacer clic en el botón de iniciar sesión
    cy.get('button').contains('Iniciar Sesión').should('be.visible').click();


    // Verificar que se redirige a la página de sesiones
    cy.url().should('include', '/sessions');

    // Verificar que la página de sesiones muestra las sesiones correctamente
    cy.get('.sessions-title').should('contain', 'Próximas Sesiones');
  });
});
