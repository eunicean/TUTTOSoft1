describe('API Endpoints Testing - Invalid Token', () => {
  let authToken;

  before(() => {
      // Obtener un token JWT válido para pruebas
      cy.request('POST', 'http://localhost:5000/api/login', {
          email: 'updateduser4@uvg.edu.gt', // Asegúrate de usar credenciales correctas para obtener un token real
          password: 'hash1'
      }).then((response) => {
          expect(response.status).to.eq(200);
          authToken = `Bearer ${response.body.token}invalid`;
      });
  });
  
    it('GET /api/get-username-by-email - Should return username', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/get-username-by-email?email=hello@uvg.edu.gt',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        
        expect(response.status).to.eq(403);
      });
    });

    it('GET /api/profile - Should return user profile', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/profile',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
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
          username: 'hola',
          email: 'hola@uvg.com.gt'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
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
          subject: '101',
          mode: 'VIRTUAL',
          studentEmail: 'updateduser4@uvg.edu.gt'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  
    it('GET /api/sessions - Should return sessions by period', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/sessions?periodo=manana',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  
    it('GET /api/sessions/:sessionId - Should return session details', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/sessions/25',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
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
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
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
          message: 'didnt show up'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
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
                sessionId: 25, 
                reason: 'Scheduling conflict'
              },
              failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('GET /api/session-history - Should return session history', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/session-history',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  
    it('GET /api/chats/:chatId - Should return chat messages', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/chats/14',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  
    it('GET /api/chats - Should return user chats', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:5000/api/chats',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
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
          id_recipient: 7,
          message: 'Hello cypress test!'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  });
  