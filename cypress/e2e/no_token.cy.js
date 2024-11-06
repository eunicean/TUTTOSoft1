describe('API Endpoints Testing - No Token', () => {

  it('GET /api/profile - No token should return 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5000/api/profile',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('POST /api/profile/update - No token should return 401', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/profile/update',
      body: {
        username: 'hola',
        email: 'hola@uvg.com.gt'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('POST /api/sessions/create - No token should return 401', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/sessions/create',
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
      expect(response.status).to.eq(401);
    });
  });

  it('GET /api/sessions - No token should return 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5000/api/sessions?periodo=manana',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /api/sessions/:sessionId - No token should return 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5000/api/sessions/25',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('POST /api/grade-session/:sessionID - No token should return 401', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/grade-session/25',
      body: {
        calificacion: 5,
        comentario: 'Great session!'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('POST /api/report-absence/:sessionID - No token should return 401', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/report-absence/25',
      body: {
        message: 'didnt show up'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('POST /api/cancel-session/:sessionID - No token should return 401', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/cancel-session/25',
      body: {
        sessionId: 25,
        reason: 'Scheduling conflict'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /api/session-history - No token should return 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5000/api/session-history',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /api/chats/:chatId - No token should return 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5000/api/chats/14',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /api/chats - No token should return 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5000/api/chats',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('POST /api/send-message - No token should return 401', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/send-message',
      body: {
        id_recipient: 7,
        message: 'Hello cypress test!'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
