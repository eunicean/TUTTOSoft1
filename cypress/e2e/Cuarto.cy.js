// cypress/e2e/crearYEliminarUsuario.cy.js

describe('Prueba de Creación y Eliminación de Usuario', () => {
  const id = 999;
  const username = 'usuarioDePrueba';
  const email = 'correo@ejemplo.com';
  const password = 'contrasena123';

  it('Debería crear y luego eliminar un usuario', () => {
    // Crear Usuario
    cy.request('POST', 'http://localhost:3000/api/crear-usuario', {
      id,
      username,
      email,
      password
    }).then((response) => {
      expect(response.status).to.equal(201); // Suponiendo que el código de éxito es 201
    });

    // Eliminar Usuario
    cy.request('DELETE', `http://localhost:3000/api/eliminar-usuario/${id}`).then((response) => {
      expect(response.status).to.equal(200); // Suponiendo que el código de éxito es 200
    });
  });
});
