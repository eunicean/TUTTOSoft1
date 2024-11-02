describe('Admin Search - Display Tutors Page', () => {
    beforeEach(() => {
      // Autenticación
      cy.request('POST', 'http://localhost:5000/api/login', {
        email: 'tutotest@uvg.edu.gt',
        password: 'hash1'
      }).then((response) => {
        expect(response.status).to.eq(200); // Verificar que la autenticación fue exitosa
        const { token } = response.body;
        localStorage.setItem('token', token); // Guardar el token en localStorage
      });
  
      // Navegar a la vista AdminSearch
      cy.visit('/AdminSearch');
    });
  
    it('should load the Admin Search page', () => {
      // Verifica que la página se haya cargado, sin revisar visibilidad específica
      cy.url().should('include', '/AdminSearch'); // Confirma que estamos en la URL correcta
    });
  });
  