describe('Prueba de Aceptación y Rechazo: Inicio de Sesión', () => {
  
  context('Pruebas de Aceptación', () => {
    it('Debería permitir iniciar sesión con credenciales correctas y redirigir a la página de sesiones', () => {
      // Visitar la página de login
      cy.visit('http://localhost:5173/login');
  
      // Introducir el correo electrónico y la contraseña correctos
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
  
      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();
  
      // Verificar que se redirige a la página de sesiones
      cy.url().should('include', '/sessions');
  
      // Verificar que la página de sesiones muestra el título correcto
      cy.get('.TituloPS').should('contain', 'Próximas Sesiones');
    });
  });

  context('Pruebas de Rechazo', () => {
    it('Debería rechazar el inicio de sesión con una contraseña incorrecta y mostrar un mensaje de error', () => {
      // Visitar la página de login
      cy.visit('http://localhost:5173/login');
  
      // Introducir el correo electrónico correcto pero una contraseña incorrecta
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('incorrectPassword');
  
      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();
  
      // Verificar que permanece en la página de login
      cy.url().should('include', '/login');
  
    });
  });
});
