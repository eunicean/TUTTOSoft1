import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // Número de usuarios virtuales
  duration: '30s', // Duración de la prueba
};

export default function () {
  // Hacer una solicitud POST al endpoint de inicio de sesión
  let loginRes = http.post('http://localhost:5000/login', {
    email: 'tutotest@uvg.edu.gt',  
    password: 'hash1', 
  });

  // Verificar que el inicio de sesión fue exitoso
  check(loginRes, {
    'login success': (r) => r.status === 200,
  });

  // Extraer el token de la respuesta
  let token = JSON.parse(loginRes.body).token;

  // Usar el token para hacer solicitudes a páginas protegidas
  let headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 2. Solicitar las sesiones agendadas
  let sessionsRes = http.get('http://localhost:5000/sessions?periodo=all', headers);

  // Verificar que la solicitud de sesiones fue exitosa
  check(sessionsRes, {
    'sessions fetched successfully': (r) => r.status === 200,
  });

  // Extraer las sesiones y mostrarlas en el log de la consola
  let sessions = JSON.parse(sessionsRes.body).sessions;
  console.log(`Found ${sessions.length} sessions`);

  // 3. Solicitar los detalles de una sesión específica (id = 18)
  let sessionDetailRes = http.get('http://localhost:5000/sessions/18', headers);

  // Verificar que la solicitud de los detalles de la sesión fue exitosa
  check(sessionDetailRes, {
    'session detail fetched successfully': (r) => r.status === 200,
  });

  // Mostrar los detalles de la sesión en el log de la consola
  let sessionDetail = JSON.parse(sessionDetailRes.body).session;
  console.log(`Session Details: ${JSON.stringify(sessionDetail)}`);

  // Esperar un segundo antes de la próxima iteración
  sleep(1);
}
