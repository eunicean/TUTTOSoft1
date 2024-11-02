// cypress/e2e/sessionstest2view.cy.js
describe('Sessions Page - Crear Nueva Sesión', () => {
        beforeEach(() => {
          // Paso 1: Realizar la solicitud de inicio de sesión para obtener el token
          cy.request('POST', 'http://localhost:5000/api/login', {
            email: 'tutotest@uvg.edu.gt',
            password: 'hash1'  
          }).then((response) => {
            expect(response.status).to.eq(200);  // Verificar que el inicio de sesión fue exitoso
            const { token } = response.body;
      
            // Paso 2: Guardar el token en localStorage para simular el inicio de sesión en Cypress
            cy.visit('/');  // Visitar la página principal para que Cypress pueda acceder al localStorage
            cy.window().then((win) => {
              win.localStorage.setItem('token', token);
            });
          });
      
          // Interceptar llamadas para simular respuestas en las pruebas
          cy.intercept('GET', '**/api/profile', {
            statusCode: 200,
            body: { success: true, user: { typeuser: '2' } }
          }).as('fetchProfile');
      
          cy.intercept('GET', '**/api/sessions', {
            statusCode: 200,
            body: {
              success: true,
              sessions: [
                {
                  id: '1',
                  date: '2024-10-10',
                  start_hour: '08:00',
                  end_hour: '10:00',
                  namecourse: 'Matemáticas',
                  mode: 'Presencial'
                }
              ]
            }
          }).as('fetchSessions');
      
          // Visita la vista de sesiones después de autenticar
          cy.visit('/sessions');
          cy.wait(['@fetchProfile', '@fetchSessions']);
        });
      
        it('should display the "Crear Nueva Sesión" button for tutors', () => {
          cy.get('.create-session-button').should('be.visible');
        });
      
        it('should navigate to session creation page when "Crear Nueva Sesión" button is clicked', () => {
          cy.get('.create-session-button').first().click();
          cy.url().should('include', '/sessions/create');
        });
      });
      
  