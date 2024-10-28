describe('Prueba de Funcionalidad: Registro de usuario y verificación de existencia', () => {
  before(() => {
    // Interceptar la solicitud de registro para simular un usuario ya existente
    cy.intercept('POST', '/register', (req) => {
      req.reply({
        statusCode: 409, // Código de estado para conflicto (usuario ya existe)
        body: { message: 'User already exists' },
      });
    }).as('registerUser');
  });


  it('Debería mostrar un mensaje de error cuando el usuario ya existe', () => {
    // Visitar la página de login
    cy.visit('http://localhost:5173/login');

    // Hacer clic en el botón de registro
    cy.get('button').contains('Registrarse').should('be.visible').click();

    // Verificar la redirección a la página de registro
    cy.url().should('include', '/register');

    // Completar el formulario de registro con datos de un usuario existente
    cy.get('input[placeholder="Username"]').type('tutor');
    cy.get('input[placeholder="Email"]').type('tutotest@uvg.edu.gt');
    cy.get('input[placeholder="Password"]').type('hash1');
    cy.get('input[placeholder="Confirm Password"]').type('hash1');

    // Hacer clic en el botón de registrar
    cy.get('button').contains('Register').should('be.visible').click();

    // Verificar que se redirige a la página de sesiones
    cy.url().should('include', '/register');

    
  });
});
