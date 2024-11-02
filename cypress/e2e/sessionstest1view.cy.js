// cypress/e2e/sessionstest1view.cy.js
//Comprobar la redirección al login cuando no hay token
describe('Vista Sessions - Acceso sin autenticación', () => {
    it('Debe redirigir a /login si no hay token', () => {
      // Asegurarse de que no hay un token en el almacenamiento local
      cy.clearLocalStorage();
  
      // Intentar visitar la página de sesiones
      cy.visit('/sessions');
  
      // Verificar que redirige a la página de login
      cy.url().should('include', '/login');
    });
  });
  