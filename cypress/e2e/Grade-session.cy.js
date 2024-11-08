describe('Prueba de Calificación del Tutor en la Última Sesión Creada', () => {

  context('Pruebas de Aceptación', () => {
    it('Debería permitir calificar al tutor después de ingresar a los detalles de la sesión', () => {
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

      // Hacer clic en el botón "Calificar Tutor"
      cy.get('.calificar-sessionBTN').should('be.visible').click();

      // Seleccionar una calificación de 5 estrellas
      cy.get('.stars .star').eq(4).click({ force: true });

      // Escribir un comentario sobre el tutor
      cy.get('.comments-box').type('Es un buen tutor.');

      // Enviar la calificación
      cy.get('.submit-button').click();


    });
  });
  context('Pruebas de Rechazo', () => {
    it('Debería mostrar un mensaje de error si no se proporciona un algun dato', () => {
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

      // Hacer clic en el botón "Calificar Tutor"
      cy.get('.calificar-sessionBTN').should('be.visible').click();

      // Enviar la calificación
      cy.get('.submit-button').click();

    });
  });

});
