 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chat.css';
import { useNavigate } from 'react-router-dom'; 
import baseUrl from '../../config.js';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, setUser] = useState({});
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); 
  const cachedMessages = new Map(); 

  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);  

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
        console.log("Perfil del usuario:", response.data.user);  // Verifica que el ID del usuario sea correcto
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  };
  


const fetchChats = async () => {
  try {
    const response = await axios.get('/api/chats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.data.success) {
      const uniqueChats = removeDuplicateChats(response.data.chats);  // Elimina duplicados
      setChats(uniqueChats);
    }
  } catch (error) {
    console.error('Error al obtener los chats:', error);
  }
};

useEffect(() => {
  fetchChats();  // Llama solo una vez al montarse el componente
}, []);  // No hay dependencias para que el efecto se ejecute una sola vez

function removeDuplicateChats(chats) {
  const chatMap = new Map();
  chats.forEach(chat => {
    if (!chatMap.has(chat.chatId)) {
      chatMap.set(chat.chatId, chat);
    }
  });
  return Array.from(chatMap.values());
}

  useEffect(() => {
    if (user && user.typeuser) {
      fetchChats(); // Se ejecutará solo cuando `user.typeuser` esté disponible
    }
  }, [user.typeuser]);  // Observa solo el tipo de usuario, no el objeto completo
  
  

  const fetchMessages = async (chatId) => {
    if (cachedMessages.has(chatId)) {
      setMessages(cachedMessages.get(chatId));  // Si los mensajes están en caché, los usamos directamente
    } else {
      try {
        setIsLoadingMessages(true);
        setMessages([]);  // Limpiar los mensajes actuales
        setSelectedChat(chatId);
        console.log(baseUrl);
        const url = `${baseUrl}/api/chats/${chatId}`;
  
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
  
        if (response.data.success) {
          console.log("API response:", response.data.messages);  // Agrega este log para ver los datos de los mensajes
          setMessages(response.data.messages);
          cachedMessages.set(chatId, response.data.messages);  // Guardar en caché
  
          // Aquí agregamos los logs para verificar los mensajes y el user.id
          console.log("user.id:", user.id);
          console.log("messages:", response.data.messages);
          response.data.messages.forEach(msg => {
            console.log("msg.senderId:", msg.senderId, "=>", msg.senderId === user.id ? "Enviado" : "Recibido");
          });
        }
      } catch (error) {
        console.error('Error al obtener los mensajes del chat:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    }
  };
  
    
  
  
  const fetchTutorsOrStudents = async () => {
    if (!user.typeuser) return;

    // Usa la URL base desde las variables de entorno
    const endpoint = user.typeuser === '2' ? `${baseUrl}/api/students` : `${baseUrl}/api/tutors`;

    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      if (user.typeuser === '2') {
        setStudents(response.data);
      } else {
        setTutors(response.data);
      }
    } catch (error) {
      console.error('Error al obtener la lista de tutores/estudiantes:', error);
    }
  };


  const checkExistingChat = (userId) => {
    return chats.find(chat => chat.otherUserId === userId);
  };

  const startChatWithUser = async (userId) => {
    const existingChat = checkExistingChat(userId);
    if (existingChat) {
      setSelectedChat(existingChat.chatId);
      fetchMessages(existingChat.chatId);
      setStatusMessage('Conversación ya iniciada.');
      setTimeout(() => setStatusMessage(''), 2000);
    } else {
      try {
        // Usa la URL base desde las variables de entorno
        const url = `${baseUrl}/api/send-message`;

        const response = await axios.post(url, { id_recipient: userId, message: '' }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data.success) {
          await fetchChats();
          setSelectedChat(response.data.chatId);
          setStatusMessage('Chat iniciado con éxito');
          setTimeout(() => setStatusMessage(''), 2000);
        }
      } catch (error) {
        console.error('Error al iniciar el chat:', error);
        setStatusMessage('Error al iniciar el chat');
      }
    }
};

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && selectedChat !== null) {
      try {
        // Obtén la URL base desde las variables de entorno
        const url = `${baseUrl}/api/send-message`;

        const recipientId = chats.find(chat => chat.chatId === selectedChat)?.otherUserId;
        const response = await axios.post(url, { id_recipient: recipientId, message: inputMessage }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        if (response.data.success) {
          const newMessage = { content: inputMessage, senderUsername: user.username, senderId: user.id };
          setMessages([...messages, newMessage]);
          setInputMessage('');
          setStatusMessage('Mensaje enviado');
          setTimeout(() => setStatusMessage(''), 2000);
          await fetchChats();
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setStatusMessage('Error al enviar el mensaje');
      }
    }
  };


  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user.typeuser) {
      fetchChats();
      fetchTutorsOrStudents();
    }
  }, [user.typeuser]);

  return (
    <div className="chat-container">
      <div className="chat-history">
        <h2>Historial de Chats</h2>
        {chats.length > 0 ? (
          <ul>
          {chats.map((chat) => (
            <li key={chat.chatId} 
                onClick={() => fetchMessages(chat.chatId)} 
                className={selectedChat === chat.chatId ? 'active' : ''} 
                style={{ cursor: 'pointer' }}>
              <strong>{chat.otherUsername || 'Usuario desconocido'}</strong><br />
              <small>{chat.lastMessage}</small><br />
              <small>{new Date(chat.lastMessageTime).toLocaleString()}</small>
            </li>
          ))}
        </ul>        
        ) : <p>No hay chats disponibles.</p>}
        
        <h3>{user.typeuser === '2' ? 'Estudiantes Disponibles:' : 'Tutores Disponibles:'}</h3>
        <ul>
          {user.typeuser === '2' ? students.map(student => (
            <li key={student.id} onClick={() => startChatWithUser(student.id)}>{student.username}</li>
          )) : tutors.map(tutor => (
            <li key={tutor.id} onClick={() => startChatWithUser(tutor.id)}>{tutor.username}</li>
          ))}
        </ul>
      </div>
  
      <div className="chat-content">
  {selectedChat ? (
    <>
      {/* Contenedor de mensajes con desplazamiento */}
      <div className="chat-messages">
        {isLoadingMessages ? (
          <p>Cargando mensajes...</p>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.senderUsername === user.username ? 'user-message' : 'student-message'
              }`}
            >
              <strong>{msg.senderUsername === user.username ? 'Tú' : msg.senderUsername}:</strong> {msg.content}
            </div>
          ))          
        ) : (
          <p>No hay mensajes en esta conversación.</p>
        )}
      </div>

      {/* Campo de entrada del mensaje */}
      <div className="chat-input-container">
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
               placeholder="Escriba aquí" className="chat-input" />
        <button onClick={handleSendMessage} className="chat-button">Enviar</button>
      </div>

      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </>
  ) : <p>Selecciona un chat para comenzar</p>}
</div>

    </div>
  );
};

export default Chat;