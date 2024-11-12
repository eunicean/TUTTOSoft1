describe('Tutors Page - Verificación de búsqueda de tutores', () => {
    beforeEach(() => {
      // Paso 1: Realizar la solicitud de inicio de sesión para obtener el token y almacenarlo en localStorage
      cy.request('POST', 'http://localhost:5000/api/login', {
        email: 'tutotest@uvg.edu.gt',
        password: 'hash1'  // Asegúrate de usar la contraseña correcta
      }).then((response) => {
        expect(response.status).to.eq(200);
        const { token } = response.body;
  
        // Guardar el token en localStorage
        cy.visit('/');
        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
        });
      });
  
      // Paso 2: Interceptar la llamada a `/api/tutors` y simular una respuesta con datos de tutores
      cy.intercept('GET', '**/api/tutors', {
        statusCode: 200,
        body: [
          {
            username: 'Carlos Mendoza',
            courses: 'Matemáticas, Física',
            avg_rating: 4
          },
          {
            username: 'Ana López',
            courses: 'Química, Biología',
            avg_rating: 5
          },
          {
            username: 'Luis Pérez',
            courses: 'Física, Programación',
            avg_rating: 3
          }
        ]
      }).as('fetchTutors');
  
      // Paso 3: Interceptar la llamada a `/api/courses` y simular una respuesta con datos de cursos
      cy.intercept('GET', '**/api/courses', {
        statusCode: 200,
        body: [
          { course_code: 'MATH', namecourse: 'Matemáticas' },
          { course_code: 'PHYS', namecourse: 'Física' },
          { course_code: 'CHEM', namecourse: 'Química' }
        ]
      }).as('fetchCourses');
  
      // Visitar la página de búsqueda de tutores y esperar a que las llamadas a la API se completen
      cy.visit('/seachtutor');
      cy.wait('@fetchTutors');
      cy.wait('@fetchCourses');
    });
  
    it('debe mostrar la lista completa de tutores después de cargar la página', () => {
      // Verifica que se muestren todos los tutores simulados (3 en este caso)
      cy.get('.tutor-card-search').should('have.length', 3);
    });
  
    it('debe filtrar tutores por materia seleccionada', () => {
      // Selecciona "Física" en el filtro de materias
      cy.get('.filter-dropdown').select('Física');
      cy.wait(500); // Espera breve para asegurarse de que el filtro se aplique
  
      // Verifica que solo se muestren tutores que enseñan "Física"
      cy.get('.tutor-card-search').should('have.length', 2);
      cy.contains('Carlos Mendoza');
      cy.contains('Luis Pérez');
    });
  
    it('debe filtrar tutores por búsqueda de texto', () => {
      // Escribe "Ana" en el campo de búsqueda
      cy.get('.search-input').type('Ana');
      cy.wait(500); // Espera breve para asegurarse de que el filtro se aplique
  
      // Verifica que solo se muestre el tutor con el nombre "Ana López"
      cy.get('.tutor-card-search').should('have.length', 1);
      cy.contains('Ana López');
  
      // Limpia el campo de búsqueda y busca por "Física"
      cy.get('.search-input').clear().type('Física');
      cy.wait(500); // Espera breve para asegurarse de que el filtro se aplique
  
      // Verifica que se muestren los tutores que enseñan "Física"
      cy.get('.tutor-card-search').should('have.length', 2);
      cy.contains('Carlos Mendoza');
      cy.contains('Luis Pérez');
    });
  });
  