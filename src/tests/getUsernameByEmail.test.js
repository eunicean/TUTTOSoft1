import request from 'supertest';
import { app } from '../backend/main.js';  // Importa correctamente el servidor Express

describe('GET /get-username-by-email', () => {
  let server;

  // Iniciar el servidor antes de todas las pruebas
  beforeAll((done) => {
    server = app.listen(5000, done);  // Asegúrate de cambiar el puerto si 5000 ya está en uso o si usas otro en tu configuración
  });

  // Cerrar el servidor después de todas las pruebas
  afterAll((done) => {
    server.close(done);
  });

  it('should return the username for a given email', async () => {
    const email = 'correo_incorrecto@uvg.edu.gt';
    await request(app)
      .get('/get-username-by-email')
      .query({ email })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({ username: 'josep' });
        // Asegurarte de cerrar aquí cualquier conexión abierta si es posible
      });
  });
  
});
