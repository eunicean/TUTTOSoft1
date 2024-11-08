describe('Prueba de Aceptación y Rechazo: Reportar Ausencia en la Última Sesión Creada', () => {

  context('Pruebas de Rechazo', () => {
    it('Debería mostrar un mensaje de error si no se proporciona un motivo de ausencia', () => {
      // Realizar el inicio de sesión y llegar hasta la página de detalles de la sesión
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();

      // Verificar que estamos en la página de sesiones
      cy.url().should('include', '/sessions');
      cy.get('.TituloPS').should('contain', 'Próximas Sesiones');

      // Esperar a que la lista de sesiones esté cargada
      cy.get('.MuiCard-root').should('have.length.greaterThan', 0);

      // Seleccionar la última sesión y hacer clic en "Cancelar" para ir a la vista de detalles del tutor
      cy.get('.MuiCard-root').last().within(() => {
        cy.contains('Cancelar').click();
      });

      // Verificar redirección a la página de detalles de la sesión
      cy.url().should('include', '/DetallesTutor');

      // Hacer clic en el botón "Reportar Ausencia"
      cy.get('.reportar-sessionBTN').should('be.visible').click();


      // Intentar enviar sin proporcionar un motivo de ausencia
      cy.get('.absence-submit-button').click();

      });
  });

  context('Pruebas de Aceptación', () => {
    it('Debería permitir iniciar sesión, redirigir a la página de sesiones y reportar ausencia con éxito', () => {
      // Visitar la página de login
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();

      // Verificar que estamos en la página de sesiones
      cy.url().should('include', '/sessions');
      cy.get('.TituloPS').should('contain', 'Próximas Sesiones');

      // Esperar a que la lista de sesiones esté cargada
      cy.get('.MuiCard-root').should('have.length.greaterThan', 0);

      // Seleccionar la última sesión y hacer clic en "Cancelar" para ir a la vista de detalles del tutor
      cy.get('.MuiCard-root').last().within(() => {
        cy.contains('Cancelar').click();
      });

      // Verificar redirección a la página de detalles de la sesión
      cy.url().should('include', '/DetallesTutor');

      // Hacer clic en el botón "Reportar Ausencia"
      cy.get('.reportar-sessionBTN').should('be.visible').click();


      // Proporcionar el motivo de la ausencia y enviar
      cy.get('.absence-reason-textarea').type('Problemas familiares');
      cy.get('.absence-submit-button').click();
      
      
    });
  });

});
