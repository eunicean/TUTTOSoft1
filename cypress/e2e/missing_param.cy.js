describe('API Endpoints Testing - Missing or Incorrect Parameters', () => {
    let authToken;

    before(() => {
        // Obtener un token JWT válido para pruebas
        cy.request('POST', 'http://localhost:5000/api/login', {
            email: 'updateduser4@uvg.edu.gt',
            password: 'hash1'
        }).then((response) => {
            expect(response.status).to.eq(200);
            authToken = `Bearer ${response.body.token}`;
        });
    });

    it('POST /api/register - Missing role parameter', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/register',
            body: { username: 'newuser', email: 'newuser@uvg.edu.gt', password: 'password123' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

    it('POST /api/profile/update - Missing email field', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/profile/update',
            headers: { Authorization: authToken },
            body: { username: 'updatedname' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

    it('POST /api/sessions/create - Missing startHour field', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/sessions/create',
            headers: { Authorization: authToken },
            body: { date: '2024-12-01', endHour: '10:00:00', subject: 'Math', mode: 'VIRTUAL', studentEmail: 'student@uvg.edu.gt' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });


    it('POST /api/grade-session/:sessionID - Missing calificacion field', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/grade-session/25',
            headers: { Authorization: authToken },
            body: { },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

    it('POST /api/report-absence/:sessionID - Missing message field', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/report-absence/25',
            headers: { Authorization: authToken },
            body: {},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

    it('POST /api/cancel-session/:sessionID - Missing reason field', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/cancel-session/25',
            headers: { Authorization: authToken },
            body: { sessionId: 25 },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

    it('GET /api/sessions - Incorrect periodo parameter', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:5000/api/sessions?periodo=wrongperiod',
            headers: { Authorization: authToken },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });

});
