import React, { useState } from "react";
import "../css/Imagen.css"; // Importar el archivo CSS

function ProfileAvatar() {
  const [image, setImage] = useState(null); // Estado para almacenar la imagen subida

  // Manejar la carga de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Convertir el archivo a una URL base64
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-avatar-container">
      <label className="profile-avatar" style={{ backgroundImage: image ? `url(${image})` : "none" }}>
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
