import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    "baseUrl": "http://localhost:3000", // Cambia al puerto correcto
    setupNodeEvents(on, config) {
      // Implementa los event listeners aquí si es necesario
    },
  },
});
