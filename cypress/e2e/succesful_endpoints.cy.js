describe('API Endpoints Testing', () => {
    let authToken;
  
    before(() => {
      // Autenticar y obtener el token JWT
      cy.request('POST', 'http://localhost:5000/api/login', {
        email: 'updateduser4@uvg.edu.gt',
        password: 'hash1'
      }).then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.token;
      });
    });
  
    it('GET /api/get-username-by-email - Should return username', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/get-username-by-email?email=updateduser4@uvg.edu.gt',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('username');
      });
    });
  
    it('POST /api/register - Should register a new user', () => {
      cy.request('POST', 'http://localhost:5000/api/register', {
        username: 'testuser',
        email: 'testuser@uvg.edu.gt',
        password: 'hash1',
        role: 'student'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('GET /api/users/type - Should return user type', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/users/type?userId=19',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('tipoUsuario');
      });
    });
  
    it('GET /api/users/sessions - Should return user sessions', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/users/sessions?userId=19',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('sesiones');
      });
    });
  
    it('GET /api/profile - Should return user profile', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/profile',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('POST /api/profile/update - Should update user profile', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/profile/update',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          username: 'updateduser4',
          email: 'updateduser4@uvg.edu.gt'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('POST /api/sessions/create - Should create a session', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/sessions/create',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          date: '2024-12-01',
          startHour: '08:00:00',
          endHour: '10:00:00',
          subject: 'Mathematics',
          mode: 'online',
          studentEmail: 'student@uvg.edu.gt'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('GET /api/sessions - Should return sessions by period', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/sessions?periodo=manana',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('sessions');
      });
    });
  
    it('GET /api/sessions/:sessionId - Should return session details', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/sessions/25',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('POST /api/grade-session/:sessionID - Should grade a session', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/grade-session/25',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          calificacion: 5,
          comentario: 'Great session!'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('POST /api/report-absence/:sessionID - Should report an absence', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/report-absence/25',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          message: 'Student was absent'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  
    it('POST /api/cancel-session/:sessionID - Should cancel a session', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/cancel-session/25',
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            body: {
                sessionId: 25, // Añadir sessionId al cuerpo, como el endpoint lo requiere
                reason: 'Scheduling conflict'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);
        });
    });

    it('GET /api/session-history - Should return session history', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/session-history',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('sessions');
      });
    });
  
    it('GET /api/courses - Should return all courses', () => {
      cy.request('GET', 'http://localhost:5000/api/courses').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  
    it('GET /api/tutors - Should return all tutors', () => {
      cy.request('GET', 'http://localhost:5000/api/tutors').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  
    it('GET /api/students - Should return all students', () => {
      cy.request('GET', 'http://localhost:5000/api/students').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  
    it('GET /api/chats/:chatId - Should return chat messages', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/chats/1',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('messages');
      });
    });
  
    it('GET /api/chats - Should return user chats', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/chats',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('chats');
      });
    });
  
    it('POST /api/send-message - Should send a message', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/send-message',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          id_recipient: 2, // Cambia al ID de un usuario válido
          message: 'Hello!'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  });
  