import React, { useState } from "react";
import "../css/Imagen.css"; // Importar el archivo CSS

function ProfileAvatar({ onImageChange }) {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = () => {
              const base64 = reader.result;

              // Reducir resolución de la imagen
              resizeImage(base64, 200, 200) // Cambia 200x200 por las dimensiones deseadas
                  .then((resizedBase64) => {
                      setImage(resizedBase64);
                      if (onImageChange) {
                          onImageChange(resizedBase64); // Envía la imagen reducida al componente padre
                      }
                  })
                  .catch((error) => console.error("Error al reducir resolución de la imagen:", error));
          };
          reader.readAsDataURL(file);
      }
  };

  // Función para reducir resolución
  const resizeImage = (base64Str, maxWidth, maxHeight) => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              // Mantener la proporción
              let width = img.width;
              let height = img.height;

              if (width > maxWidth || height > maxHeight) {
                  if (width > height) {
                      height = (maxHeight / width) * height;
                      width = maxWidth;
                  } else {
                      width = (maxWidth / height) * width;
                      height = maxHeight;
                  }
              }

              canvas.width = width;
              canvas.height = height;

              // Dibujar la imagen redimensionada en el canvas
              ctx.drawImage(img, 0, 0, width, height);

              // Convertir el canvas a base64
              const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8); // 0.8 es la calidad del JPEG (80%)
              resolve(resizedBase64);
          };

          img.onerror = (err) => reject(err);
          img.src = base64Str;
      });
  };

  return (
      <div className="profile-avatar-container">
          <label 
              className="profile-avatar" 
              style={{ backgroundImage: image ? `url(${image})` : "none" }}
          >
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
              />
          </label>
      </div>
  );
}

export default ProfileAvatar;
