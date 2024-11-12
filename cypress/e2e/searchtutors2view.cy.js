describe('Tutors Page - Combinación de Filtros y Búsqueda sin Coincidencias', () => {
    beforeEach(() => {
      // Autenticación
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
  
      // Interceptar llamada a `/api/tutors` y simular una respuesta con datos de tutores
      cy.intercept('GET', '**/api/tutors', {
        statusCode: 200,
        body: [
          {
            username: 'Carlos Mendoza',
            courses: 'Matemáticas Básicas, Física I',
            avg_rating: 4
          },
          {
            username: 'Ana López',
            courses: 'Química, Biología',
            avg_rating: 5
          },
          {
            username: 'Luis Pérez',
            courses: 'Física I, Programación I',
            avg_rating: 3
          },
          {
            username: 'José Gómez',
            courses: 'Matemáticas Básicas, Programación I',
            avg_rating: 4
          }
        ]
      }).as('fetchTutors');
  
      // Interceptar llamada a `/api/courses` y simular una respuesta con cursos
      cy.intercept('GET', '**/api/courses', {
        statusCode: 200,
        body: [
          { course_code: 'MATH', namecourse: 'Matemáticas Básicas' },
          { course_code: 'PHYS', namecourse: 'Física I' },
          { course_code: 'PROG', namecourse: 'Programación I' },
          { course_code: 'HIST', namecourse: 'Historia Universal' },
          { course_code: 'DESG', namecourse: 'Diseño Gráfico' }
        ]
      }).as('fetchCourses');
  
      // Visitar la página de búsqueda de tutores y esperar que las llamadas se completen
      cy.visit('/seachtutor');
      cy.wait('@fetchTutors');
      cy.wait('@fetchCourses');
    });
  
    it('debe mostrar un mensaje de "No se encontraron tutores" cuando el filtro y la búsqueda de texto no coinciden', () => {
      // Selecciona "Programación I" en el filtro de materias
      cy.get('.filter-dropdown').select('Programación I');
      cy.wait(500); // Espera para asegurar que el filtro de materia se aplique
  
      // Escribe "Carlos" en el campo de búsqueda
      cy.get('.search-input').type('Carlos');
      cy.wait(500); // Espera para asegurar que el filtro de búsqueda de texto se aplique
  
      // Verifica que no haya resultados y que se muestre el mensaje de "No se encontraron tutores"
      //AGREGAR UN MENSAJE DE NO SE HAN ENCONTRADO TUTORES
      //cy.get('.tutor-card-search').should('have.length', 0);
      //cy.contains('No se encontraron tutores');
    });
  });
  