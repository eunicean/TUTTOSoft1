# Usar una imagen base con Node.js
FROM node:21.6.2

<<<<<<< HEAD
# Establecer el directorio de trabajo para la aplicación
WORKDIR /app
=======
WORKDIR /TUTTOSoft1
>>>>>>> cancelar-sesion

# Copiar los archivos de configuración de la aplicación
COPY ../../package*.json ./

<<<<<<< HEAD
# Instalar las dependencias de la aplicación
RUN npm install
=======
RUN npm install express

RUN npm install cors

RUN npm install mysql2
>>>>>>> cancelar-sesion

# Copiar el resto del código de la aplicación
COPY ../../ .

# Exponer los puertos necesarios
EXPOSE 5173 5000 

# Comando para iniciar la aplicación
CMD ["npm", "start"]
