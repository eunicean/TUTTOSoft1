import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chat.css'; // Asegúrate de tener los estilos personalizados

const Chat = () => {
  const [chats, setChats] = useState([]); // Aquí se guardarán los chats que vienen desde el backend
  const [selectedChat, setSelectedChat] = useState(null); // Chat seleccionado
  const [messages, setMessages] = useState([]); // Mensajes del chat seleccionado
  const [inputMessage, setInputMessage] = useState(''); // Mensaje que el usuario está escribiendo
  const [statusMessage, setStatusMessage] = useState(''); // Mensaje temporal de "mensaje enviado"
  const [user, setUser] = useState({}); // Datos del usuario (perfil)
  const [tutors, setTutors] = useState([]); // Lista de tutores disponibles para iniciar un chat
  const [students, setStudents] = useState([]); // Lista de estudiantes disponibles

  // Función para obtener los datos del perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT desde localStorage
        },
      });
      if (response.data.success) {
        setUser(response.data.user); // Actualiza los datos del usuario
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  };

  // Función para obtener la lista de chats desde el backend
const fetchChats = async () => {
  try {
    const response = await axios.get('/chats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.data.success) {
      console.log('Chats obtenidos:', response.data.chats);
      setChats(response.data.chats); // Actualiza la lista de chats
    } else {
      console.log('No se encontraron chats');
      setChats([]); // Si no hay chats, asegura que el estado esté vacío
    }
  } catch (error) {
    if (error.response && error.response.status === 500 && error.response.data.message.includes("doesn't exist")) {
      console.error('La tabla de usuarios no existe. Contacte al administrador.');
    } else {
      console.error('Error al obtener los chats:', error);
    }
  }
};


  // Función para obtener los mensajes de un chat específico
  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setMessages(response.data.messages); // Actualiza los mensajes del chat seleccionado
        setSelectedChat(chatId); // Marca el chat como seleccionado
      }
    } catch (error) {
      console.error('Error al obtener los mensajes del chat:', error);
    }
  };

  // Función para obtener la lista de tutores o estudiantes dependiendo del tipo de usuario
  const fetchTutorsOrStudents = async () => {
    if (!user.typeuser) return; // Si el tipo de usuario no está listo, no continuar
    try {
      const endpoint = user.typeuser === '2' ? '/students' : '/tutors'; // Dependiendo del tipo de usuario, obtenemos tutores o estudiantes
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (user.typeuser === '2') {
        setStudents(response.data); // Si es tutor, guarda los estudiantes
      } else {
        setTutors(response.data); // Si es estudiante, guarda los tutores
      }
    } catch (error) {
      console.error('Error al obtener la lista de tutores/estudiantes:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Obtener el perfil al montar el componente
  }, []);

  useEffect(() => {
    if (user.typeuser) {
      fetchChats(); // Obtener los chats una vez que se obtenga el perfil del usuario
      fetchTutorsOrStudents(); // Obtener la lista de tutores o estudiantes
    }
  }, [user.typeuser]); // Solo ejecutar cuando `user.typeuser` esté listo

  // Función para iniciar un chat con un tutor o estudiante
  const startChatWithUser = async (userId) => {
    try {
      console.log('Iniciando chat con el usuario ID:', userId); // Log para verificar el userId

      // Enviar un mensaje vacío para iniciar el chat
      const response = await axios.post(
        '/send-message',
        { id_recipient: userId, message: '' }, // Enviar un primer mensaje vacío
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Chat iniciado con éxito:', response.data);
        await fetchChats(); // Asegurarse de que la lista de chats se actualice correctamente
        setSelectedChat(response.data.chatId); // Seleccionar el chat recién iniciado
        setStatusMessage('Chat iniciado con éxito');
        setTimeout(() => setStatusMessage(''), 2000);
      }
    } catch (error) {
      console.error('Error al iniciar el chat:', error);
      setStatusMessage('Error al iniciar el chat');
    }
  };

  // Función para enviar un mensaje
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && selectedChat !== null) {
      try {
        const response = await axios.post(
          '/send-message',
          { id_recipient: selectedChat, message: inputMessage },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.data.success) {
          setMessages([...messages, { content: inputMessage, senderUsername: 'Tú' }]);
          setInputMessage(''); // Limpiar el campo de entrada
          setStatusMessage('Mensaje enviado');
          setTimeout(() => setStatusMessage(''), 2000);
          await fetchChats(); // Actualizar la lista de chats para reflejar el último mensaje
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setStatusMessage('Error al enviar el mensaje');
      }
    }
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
                onClick={() => fetchMessages(chat.chatId)} // Obtiene los mensajes del chat seleccionado
                className={selectedChat === chat.chatId ? 'active' : ''}
              >
                <strong>{chat.otherUsername}</strong>
                <br />
                <small>{chat.lastMessage}</small> {/* Mostrar el último mensaje */}
                <br />
                <small>{new Date(chat.lastMessageTime).toLocaleString()}</small> {/* Mostrar la hora del último mensaje */}
              </li>
            ))
          ) : (
            <p>No hay chats disponibles.</p>
          )}
        </ul>
        
        {/* Mostrar la lista de tutores o estudiantes según el tipo de usuario */}
        <h3>{user.typeuser === '2' ? 'Estudiantes Disponibles:' : 'Tutores Disponibles:'}</h3>
        <ul>
          {user.typeuser === '2'
            ? students.map((student) => (
                <li key={student.id} onClick={() => startChatWithUser(student.id)}>
                  {student.username}
                </li>
              ))
            : tutors.map((tutor) => (
                <li key={tutor.id} onClick={() => startChatWithUser(tutor.id)}>
                  {tutor.username}
                </li>
              ))}
        </ul>
      </div>

      {/* Mensajes del chat seleccionado */}
      <div className="chat-content">
        {selectedChat ? (
          <>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.senderUsername === 'Tú' ? 'user-message' : 'student-message'
                  }`}
                >
                  <strong>{msg.senderUsername}:</strong> {msg.content}
                </div>
              ))}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
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
          <p>Selecciona un chat para comenzar</p>
        )}
      </div>
    </div>
  );
};

export default Chat;