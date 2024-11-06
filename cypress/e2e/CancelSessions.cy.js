describe('Prueba de Aceptación y Rechazo: Cancelar la Última Sesión Creada', () => {

  context('Pruebas de Rechazo', () => {
    it('Debería mostrar un mensaje de error si no se proporciona una razón de cancelación', () => {
      // Realizar el inicio de sesión y llegar hasta la página de cancelación de sesión
      cy.visit('http://localhost:5173/login');
      // Introducir el correo electrónico y la contraseña
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');

      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();

      // Verificar que estamos en la página de sesiones
      cy.url().should('include', '/sessions');
      cy.get('.TituloPS').should('contain', 'Próximas Sesiones');

      // Esperar a que la lista de sesiones esté cargada
      cy.get('.MuiCard-root').should('have.length.greaterThan', 0);

      // Seleccionar la última sesión y hacer clic en "Cancelar"
      cy.get('.MuiCard-root').last().within(() => {
        cy.contains('Cancelar').click();
      });  

      // Verificar redirección a la página de detalles de la sesión
      cy.url().should('include', '/DetallesTutor');

      // Hacer clic en el botón "Cancelar Cita"
      cy.get('.cancel-button').should('be.visible').click({ force: true });

      // Confirmar redirección a la vista de Cancelar Cita
      cy.url().should('include', '/cancel-session');

      // Intentar cancelar sin proporcionar una razón
      cy.get('.submit-button').click();
  
      // Verificar que se muestra un mensaje de error indicando que la razón es obligatoria
      cy.get('.modal-content button').contains('Cerrar').click();
    });


  context('Pruebas de Aceptación', () => {
    it('Debería permitir iniciar sesión, redirigir a la página de sesiones y cancelar la última sesión con éxito', () => {
      // Visitar la página de login
      cy.visit('http://localhost:5173/login');
  
      // Introducir el correo electrónico y la contraseña
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
  
      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();
  
      // Verificar que estamos en la página de sesiones
      cy.url().should('include', '/sessions');
      cy.get('.TituloPS').should('contain', 'Próximas Sesiones');
  
      // Esperar a que la lista de sesiones esté cargada
      cy.get('.MuiCard-root').should('have.length.greaterThan', 0);
  
      // Seleccionar la última sesión y hacer clic en "Cancelar"
      cy.get('.MuiCard-root').last().within(() => {
        cy.contains('Cancelar').click();
      });  
  
      // Verificar redirección a la página de detalles de la sesión
      cy.url().should('include', '/DetallesTutor');
  
      // Hacer clic en el botón "Cancelar Cita"
      cy.get('.cancel-button').should('be.visible').click({ force: true });
  
      // Confirmar redirección a la vista de Cancelar Cita
      cy.url().should('include', '/cancel-session');
  
      // Proporcionar una razón de cancelación y confirmar
      cy.get('textarea').type('no habla cancelar cita');
      cy.get('.submit-button').click();
  
      // Confirmar en el modal
      cy.get('.modal').should('be.visible');
      cy.get('.modal-content').contains('¿Está seguro de que desea cancelar la sesión?');
      cy.get('.modal-content button').contains('Sí, cancelar sesión').click();
      

    });
  });

  });
});
