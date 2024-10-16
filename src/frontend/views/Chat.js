import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chat.css';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, setUser] = useState({});
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Nuevo estado para indicar que los mensajes están cargando
  const cachedMessages = new Map(); // Para guardar conversaciones en caché

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('/chats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (response.data.success) {
        const uniqueChats = removeDuplicateChats(response.data.chats);
        setChats(uniqueChats);
      }
    } catch (error) {
      console.error('Error al obtener los chats:', error);
    }
  };

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
    fetchUserProfile();
    if (user.typeuser) {
      fetchChats();
    }
  }, [user.typeuser]);

  const fetchMessages = async (chatId) => {
    if (cachedMessages.has(chatId)) {
      // Si los mensajes ya han sido cargados previamente, usa el caché
      setMessages(cachedMessages.get(chatId));
      return;
    }

    try {
      setIsLoadingMessages(true); // Indica que los mensajes están cargando
      setMessages([]); // Limpia los mensajes anteriores temporalmente
      setSelectedChat(chatId);

      const response = await axios.get(`/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.data.success) {
        cachedMessages.set(chatId, response.data.messages); // Cachea los mensajes
        setMessages(response.data.messages); 
      } else {
        console.error("No se pudieron cargar los mensajes.");
      }
    } catch (error) {
      console.error('Error al obtener los mensajes del chat:', error);
    } finally {
      setIsLoadingMessages(false); // Termina la carga de mensajes
    }
  };

  const fetchTutorsOrStudents = async () => {
    if (!user.typeuser) return;
    const endpoint = user.typeuser === '2' ? '/students' : '/tutors';
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
        const response = await axios.post('/send-message', { id_recipient: userId, message: '' }, {
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
        const recipientId = chats.find(chat => chat.chatId === selectedChat)?.otherUserId;
        const response = await axios.post('/send-message', { id_recipient: recipientId, message: inputMessage }, {
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
                <strong>{chat.otherUsername}</strong><br />
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
            <div className="chat-messages">
            {isLoadingMessages ? (
              <p>Cargando mensajes...</p>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.senderId === user.id ? 'user-message' : 'student-message'}`}>
                  <strong>{msg.senderId === user.id ? 'Tú' : msg.senderUsername}:</strong> {msg.content}
                </div>
              ))
            ) : (
              <p>No hay mensajes en esta conversación.</p>
            )}
          </div>

            
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
