import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chat.css'; // Asegúrate de tener los estilos personalizados

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, setUser] = useState({});
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);

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
      const response = await axios.get('/chats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setChats(response.data.chats);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error('Error al obtener los chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setMessages(response.data.messages);
        setSelectedChat(chatId);
      }
    } catch (error) {
      console.error('Error al obtener los mensajes del chat:', error);
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

  const startChatWithUser = async (userId) => {
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
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && selectedChat !== null) {
      try {
        const response = await axios.post('/send-message', { id_recipient: selectedChat, message: inputMessage }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
          setMessages([...messages, { content: inputMessage, senderUsername: 'Tú' }]);
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
              <li key={chat.chatId} onClick={() => fetchMessages(chat.chatId)}
                  className={selectedChat === chat.chatId ? 'active' : ''}>
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
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.senderId === user.id ? 'user-message' : 'student-message'}`}>
                  <strong>{msg.senderId === user.id ? 'Tú' : msg.senderUsername}:</strong> {msg.content}
                </div>
              ))}
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
