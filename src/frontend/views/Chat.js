import React, { useState } from 'react';
import '../css/Chat.css'; // Importar el archivo CSS para estilos personalizados


const Chat = () => {
  // Creamos un estado para almacenar los mensajes de cada chat
  const [chats, setChats] = useState([
    { id: 1, user: 'Estudiante 1', messages: [{ sender: 'Estudiante 1', text: 'Hola' }] },
    { id: 2, user: 'Estudiante 2', messages: [{ sender: 'Estudiante 2', text: '¿Cómo estás?' }] },
    { id: 3, user: 'Estudiante 3', messages: [{ sender: 'Estudiante 3', text: 'Gracias por tu ayuda' }] },
  ]);
  const [selectedChat, setSelectedChat] = useState(null); // El chat seleccionado
  const [inputMessage, setInputMessage] = useState(''); // El mensaje que el usuario está escribiendo
  const [statusMessage, setStatusMessage] = useState(''); // Mensaje temporal de "mensaje enviado"


  // Función para simular la respuesta del estudiante seleccionado
  const simulateStudentResponse = (chatId) => {
    setTimeout(() => {
      const response = { sender: `Estudiante ${chatId}`, text: 'Respuesta automática' };
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, response] } // Añadir la respuesta automática
            : chat
        )
      );
      // Forzar la actualización del chat seleccionado
      setSelectedChat((prevSelectedChat) => {
        if (prevSelectedChat && prevSelectedChat.id === chatId) {
          return {
            ...prevSelectedChat,
            messages: [...prevSelectedChat.messages, response],
          };
        }
        return prevSelectedChat;
      });
    }, 2000); // Simulamos un retraso de 2 segundos
  };


  // Función para enviar un mensaje
  const handleSendMessage = () => {
    if (inputMessage.trim() !== '' && selectedChat !== null) {
      const userMessage = { sender: 'Tú', text: inputMessage }; // Mensaje enviado por el usuario
      // Actualizamos los mensajes del chat seleccionado
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, messages: [...chat.messages, userMessage] } // Agregamos el mensaje al historial del chat
            : chat
        )
      );
      // Actualizamos el estado de selectedChat para forzar el renderizado del nuevo mensaje
      setSelectedChat((prevSelectedChat) => ({
        ...prevSelectedChat,
        messages: [...prevSelectedChat.messages, userMessage],
      }));
      setInputMessage(''); // Limpiar el campo de entrada


      // Mostrar el mensaje de estado inmediatamente
      setStatusMessage('Mensaje enviado');
      setTimeout(() => {
        setStatusMessage('');
      }, 2000); // Ocultar el mensaje después de 2 segundos


      simulateStudentResponse(selectedChat.id); // Simulamos la respuesta del estudiante
    }
  };


  // Función para manejar el evento de la tecla "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };


  // Función para seleccionar un chat (estudiante)
  const handleChatSelect = (chat) => {
    setSelectedChat(chat); // Seleccionamos el chat (estudiante)
  };


  return (
    <div className="chat-container">
      {/* Sección de historial de chats */}
      <div className="chat-history">
        <h2>Historial de Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={selectedChat?.id === chat.id ? 'active' : ''}
            >
              {chat.user}
              <br />
              <small>{chat.messages[chat.messages.length - 1]?.text}</small> {/* Último mensaje */}
            </li>
          ))}
        </ul>
      </div>


      {/* Sección del chat actual */}
      <div className="chat-content">
        {selectedChat ? (
          <>
            <div className="chat-messages">
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender === 'Tú' ? 'user-message' : 'student-message'}`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>


            <div className="chat-input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escriba aquí"
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="chat-button">
                Enviar
              </button>
            </div>


            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </>
        ) : (
          <p>Selecciona un estudiante para comenzar a chatear</p>
        )}
      </div>
    </div>
  );
};


export default Chat;