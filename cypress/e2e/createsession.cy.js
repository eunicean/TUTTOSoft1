describe('Prueba de Aceptación y Rechazo: Crear una Sesión', () => {

  context('Pruebas de Aceptación', () => {
    it('Debería permitir iniciar sesión y crear una sesión con datos válidos', () => {
      // Visitar la página de login
      cy.visit('http://localhost:5173/login');
  
      // Introducir el correo electrónico y la contraseña
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
  
      // Hacer clic en el botón de iniciar sesión
      cy.get('button').contains('Iniciar Sesión').should('be.visible').click();
  
      // Verificar que se redirige a la página de sesiones
      cy.url().should('include', '/sessions');
  
      // Verificar que la página de sesiones muestra el título correcto
      cy.get('.TituloPS').should('contain', 'Próximas Sesiones');
  
      // Hacer clic en el botón "Crear Nueva Sesión"
      cy.get('.create-session-button').contains('Crear Nueva Sesión').click();
  
      // Verificar que se redirige a la vista de creación de sesión
      cy.url().should('include', '/sessions/create');
  
      // Seleccionar un curso de la lista desplegable
      cy.get('select[name="subject"]').select('Física I');
  
      // Llenar los campos de fecha, hora de inicio y finalización
      cy.get('input[name="date"]').type('2024-10-30');
      cy.get('input[name="startHour"]').type('10:00');
      cy.get('input[name="endHour"]').type('11:00');
  
      // Seleccionar la modalidad
      cy.get('select[name="mode"]').select('PRESENCIAL');
  
      // Introducir el correo del estudiante
      cy.get('input[name="studentEmail"]').type('josep@uvg.edu.gt');
  
      // Hacer clic en el botón para crear la sesión
      cy.get('button').contains('Crear Sesión').click();
  
      // Verificar que se redirige a la página de sesiones
      cy.url().should('include', '/sessions');
    });
  });

  context('Pruebas de Rechazo', () => {
    it('Debería mostrar un mensaje de error si faltan datos obligatorios al crear una sesión', () => {
      // Visitar la página de creación de sesión directamente después de iniciar sesión
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').type('tutotest@uvg.edu.gt');
      cy.get('input[type="password"]').type('hash1');
      cy.get('button').contains('Iniciar Sesión').click();
      cy.url().should('include', '/sessions');
      cy.get('.create-session-button').contains('Crear Nueva Sesión').click();

       // Llenar los campos de fecha, hora de inicio y finalización
       cy.get('input[name="date"]').type('2024-10-30');
       cy.get('input[name="startHour"]').type('10:00');
       cy.get('input[name="endHour"]').type('11:00');
  
      // No ingresar ningún dato en el formulario y hacer clic en "Crear Sesión"
      cy.get('button').contains('Crear Sesión').click();

    });
  });
});
