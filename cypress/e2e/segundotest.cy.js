describe('Prueba de Integración: Inicio de Sesión y Redirección a Sesiones', () => {
    before(() => {
      // Interceptar la solicitud de inicio de sesión
      cy.intercept('POST', '/login', {
        statusCode: 200,
        body: { token: 'dummy-token' } // Simular una respuesta de inicio de sesión exitoso
      }).as('loginRequest');
      
      // Interceptar la solicitud de sesiones
      cy.intercept('GET', '/api/sessions', { fixture: 'sessions.json' }).as('getSessions');
    });
  
    it('Debería permitir iniciar sesión, redirigir a la página de sesiones y verificar la integración completa', () => {
      // Visitar la página de login
      cy.visit('http://localhost:5173/login');
  
      // Introducir el correo electrónico y la contraseña
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
  
      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();
  
      // Esperar a que la solicitud de inicio de sesión se complete
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  
      // Verificar la redirección a la página de sesiones
      cy.url().should('include', '/sessions');
  
      // Esperar a que la solicitud de sesiones se complete
      cy.wait('@getSessions').its('response.statusCode').should('eq', 200);
  
      // Verificar que la página de sesiones muestra las sesiones correctamente
      cy.get('.sessions-title').should('contain', 'Próximas Sesiones');
      cy.get('.session-item').should('have.length.greaterThan', 0); // Verificar que hay al menos una sesión
      cy.get('.session-item').first().should('contain', 'Sesión de Ejemplo'); // Verificar contenido de una sesión
    });
  });
  