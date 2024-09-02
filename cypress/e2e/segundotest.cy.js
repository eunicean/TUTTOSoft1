describe('Prueba de Integración: Inicio de Sesión y Redirección a Sesiones', () => {
  before(() => {
    // Interceptar la solicitud de inicio de sesión
    cy.intercept('GET', '/api/sessions', (req) => {
      req.headers['Authorization'] = 'Bearer dummy-token'; // Añadir el token de autenticación si es necesario
      req.reply({ fixture: 'sessions.json' });
    }).as('getSessions');
    
    // Interceptar la solicitud de sesiones
    cy.intercept('GET', '/api/sessions', (req) => {
      req.headers['Authorization'] = 'Bearer dummy-token'; // Agregar token en el encabezado
      req.reply({ fixture: 'sessions.json' });
    }).as('getSessions');
  });

  it('Debería permitir iniciar sesión, redirigir a la página de sesiones y verificar la integración completa', () => {
    // Visitar la página de login
    cy.visit('http://localhost:5173/login');

    // Introducir el correo electrónico y la contraseña
    cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
    cy.get('input[type="password"]').type('hash1');

    // Hacer clic en el botón de iniciar sesión
    cy.get('button').contains('Iniciar Sesión').click();

    // Verificar la redirección a la página de sesiones
    cy.url().should('include', '/sessions');

    // Verificar que la página de sesiones está completamente cargada
    cy.get('body').should('not.have.class', 'loading');

  });
});
