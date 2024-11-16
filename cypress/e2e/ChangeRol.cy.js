describe('Prueba de Aceptación y Rechazo: Cambio de Rol en la Vista AdminTutor', () => {

  context('Pruebas de Aceptación', () => {
    it('Debería permitir iniciar sesión como tutor, acceder a la vista AdminTutor y alternar entre Buscar Tutor y Buscar Estudiante', () => {
      // Visitar la página de login
      cy.viewport(1274, 920) // Set viewport to 550px x 750px
      cy.visit('http://localhost:5173/login');
  
      // Introducir el correo electrónico y la contraseña correctos
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
   
      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();

      // Verificar que se redirige a la página de sesiones
      cy.url().should('include', '/sessions');

      // Navegar a la vista de administración
      cy.visit('http://localhost:5173/adminsearch');
      cy.url().should('include', '/adminsearch');

      // Presionar el contenedor del checkbox para alternar a "Buscar Estudiante"
      cy.get('.checkbox-container').click();
      cy.wait(500); // Espera para dar tiempo al cambio de vista
      cy.contains('h1', 'Buscar Estudiante').should('be.visible');

      // Presionar el contenedor del checkbox nuevamente para alternar a "Buscar Tutor"
      cy.get('.checkbox-container').click();
      cy.wait(500); // Espera para dar tiempo al cambio de vista
      cy.contains('h1', 'Buscar Tutor').should('be.visible');

    });

    context('Pruebas de Rechazo', () => {
      it('Debería permitir iniciar sesión como tutor, acceder a la vista AdminTutor y cambiar un Tutor a Estudiante', () => {
        cy.viewport(1274, 920) // Set viewport to 550px x 750px
        cy.visit('http://localhost:5173/login');
    
        // Introducir el correo electrónico y la contraseña correctos
        cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
        cy.get('input[type="password"]').type('hash1');
    
        // Hacer clic en el botón de iniciar sesión
        cy.get('button').contains('Iniciar Sesión').should('be.visible').click();
    
        // Verificar que se redirige a la página de sesiones
        cy.url().should('include', '/sessions');
    
        // Navegar a la vista de administración
        cy.visit('http://localhost:5173/adminsearch');
        cy.url().should('include', '/adminsearch');
    
        
        // Seleccionar la tarjeta del usuario y hacer clic en el botón para cambiar el rol
        cy.get('.user-card').first().within(() => {
          // Cambiar el rol a tutor si el usuario es estudiante
          cy.get('button').contains('Cambiar a Estudiante').should('be.visible').click();
        });

      });
    });       
  });
});
