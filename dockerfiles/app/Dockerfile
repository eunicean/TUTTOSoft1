# Usar una imagen base con Node.js
FROM node:21.6.2

# Establecer el directorio de trabajo para la aplicación
WORKDIR /app

# Copiar los archivos de configuración de la aplicación
COPY ../../package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el resto del código de la aplicación
COPY ../../ .

# Exponer los puertos necesarios
EXPOSE 5173 5000 

# Comando para iniciar la aplicación
CMD ["npm", "start"]
