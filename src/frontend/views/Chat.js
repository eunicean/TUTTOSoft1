import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chat.css'; // Asegúrate de tener los estilos personalizados

const Chat = () => {
  const [chats, setChats] = useState([]); // Aquí se guardarán los chats que vienen desde el backend
  const [selectedChat, setSelectedChat] = useState(null); // Chat seleccionado
  const [inputMessage, setInputMessage] = useState(''); // Mensaje que el usuario está escribiendo
  const [statusMessage, setStatusMessage] = useState(''); // Mensaje temporal de "mensaje enviado"
  const [tutors, setTutors] = useState([]); // Lista de tutores disponibles para iniciar un chat

  // Función para obtener los chats desde el backend
  const fetchChats = async () => {
    try {
      const response = await axios.get('/chats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT desde localStorage
        },
      });
      setChats(response.data.chats); // Actualizar el estado con los chats recibidos
    } catch (error) {
      console.error('Error al obtener los chats:', error);
    }
  };

  // Llamar a fetchChats cuando el componente se monta
  useEffect(() => {
    fetchChats();
    fetchTutors(); // Cargar la lista de tutores al montar el componente
  }, []);

  // Función para obtener la lista de tutores desde el backend
  const fetchTutors = async () => {
    try {
      const response = await axios.get('/tutors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTutors(response.data); // Actualizar la lista de tutores
    } catch (error) {
      console.error('Error al obtener la lista de tutores:', error);
    }
  };

  // Función para iniciar un chat con un tutor
  const startChatWithTutor = async (tutorId) => {
    console.log('Iniciando chat con tutor ID:', tutorId); // Agrega este log para verificar el tutorId
    try {
        const response = await axios.post(
            '/start-chat',
            { tutorId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (response.data.success) {
            // Recargar los chats después de iniciar uno nuevo
            fetchChats();
            console.log('Chat iniciado con éxito:', response.data.chatId); // Agrega este log para verificar la respuesta

            // Seleccionar el chat recién iniciado
            const newChat = {
                chatId: response.data.chatId,
                chatName: `Chat con tutor ${tutorId}`,
                messages: [],
            };
            setSelectedChat(newChat);

            setStatusMessage('Chat iniciado con éxito');
            setTimeout(() => setStatusMessage(''), 2000);
        }
    } catch (error) {
        console.error('Error al iniciar el chat:', error);
    }
};


  // Función para enviar un mensaje
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && selectedChat !== null) {
      try {
        // Enviar el mensaje al backend
        const response = await axios.post(
          '/send-message',
          { chatId: selectedChat.chatId, message: inputMessage },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data.success) {
          const newMessage = { sender: 'Tú', text: inputMessage }; // Mensaje enviado por el usuario
          const updatedChats = chats.map(chat =>
            chat.chatId === selectedChat.chatId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          );

          setChats(updatedChats);
          setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, newMessage] });
          setInputMessage(''); // Limpiar el campo de entrada
          setStatusMessage('Mensaje enviado');

          // Ocultar el mensaje después de 2 segundos
          setTimeout(() => {
            setStatusMessage('');
          }, 2000);
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setStatusMessage('Error al enviar el mensaje');
      }
    }
  };

  // Función para manejar el evento de la tecla "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Función para seleccionar un chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="chat-container">
      {/* Historial de chats */}
      <div className="chat-history">
        <h2>Historial de Chats</h2>
        <ul>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <li
                key={chat.chatId}
                onClick={() => handleChatSelect(chat)}
                className={selectedChat?.chatId === chat.chatId ? 'active' : ''}
              >
                {chat.chatName}
                <br />
                <small>Integrante: {chat.otherIntegrantName}</small>
              </li>
            ))
          ) : (
            <p>No hay chats disponibles.</p>
          )}
        </ul>

        {/* Lista de tutores para iniciar un nuevo chat */}
        <h3>Iniciar chat con un tutor:</h3>
        <ul>
          {tutors.length > 0 ? (
            tutors.map((tutor) => (
              <li key={tutor.id}>
                {tutor.username} ({tutor.courses})
                <button onClick={() => startChatWithTutor(tutor.id)}>Iniciar Chat</button>
              </li>
            ))
          ) : (
            <p>No hay tutores disponibles.</p>
          )}
        </ul>
      </div>

      {/* Mensajes del chat seleccionado */}
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
                <i className="send-icon">✉️</i>
              </button>
            </div>

            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </>
        ) : (
          <p>Selecciona un chat para comenzar</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
