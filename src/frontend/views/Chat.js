import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); 
  const cachedMessages = useRef(new Map()); // Usamos useRef para mantener el caché entre renders
  // para pantallas mas pequeñas 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSmallscreen, setIsSmallscreen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const tutorId = location.state?.tutorId;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // detecta de que tamaño es la pantalla. 
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSmallscreen(true);
      } else {
        setIsSmallscreen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecutar al cargar la página

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [messages]);

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
        const uniqueChats = removeDuplicateChats(response.data.chats);
        setChats(uniqueChats);
      }
    } catch (error) {
      console.error('Error al obtener los chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchUserProfile();
  }, []);

  function removeDuplicateChats(chats) {
    const chatMap = new Map();
    chats.forEach(chat => {
      if (!chatMap.has(chat.chatId)) {
        chatMap.set(chat.chatId, chat);
      }
    });
    return Array.from(chatMap.values());
  }

  const fetchMessages = async (chatId) => {
    if (cachedMessages.current.has(chatId)) {
      setMessages(cachedMessages.current.get(chatId));
    } else {
      try {
        setIsLoadingMessages(true);
        setMessages([]);
        setSelectedChat(chatId);
        const url = `${baseUrl}/api/chats/${chatId}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data.success) {
          setMessages(response.data.messages);
          cachedMessages.current.set(chatId, response.data.messages);
        }
      } catch (error) {
        console.error('Error al obtener los mensajes del chat:', error);
      } finally {
        setIsLoadingMessages(false);
      }
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
        const url = `${baseUrl}/api/start-chat`;

        const response = await axios.post(url, { id_recipient: userId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data.success) {
          await fetchChats();
          setSelectedChat(response.data.chatId);
          fetchMessages(response.data.chatId);
          setStatusMessage('Chat iniciado con éxito');
          setTimeout(() => setStatusMessage(''), 2000);
        }
      } catch (error) {
        console.error('Error al iniciar el chat:', error);
        setStatusMessage('');
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && selectedChat !== null) {
      try {
        const url = `${baseUrl}/api/send-message`;
  
        const recipientId = chats.find(chat => chat.chatId === selectedChat)?.otherUserId;
        const response = await axios.post(url, { id_recipient: recipientId, message: inputMessage }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
  
        if (response.data.success) {
          const newMessage = { content: inputMessage, senderUsername: user.username, senderId: user.id };
          
          // Añade el mensaje al historial de mensajes
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setInputMessage('');
          setStatusMessage('Mensaje enviado');
          setTimeout(() => setStatusMessage(''), 2000);
          cachedMessages.current.set(selectedChat, [...messages, newMessage]);
  
          // Reorganiza el historial de chats para que el chat seleccionado aparezca al inicio
          setChats((prevChats) => {
            const updatedChats = prevChats.filter(chat => chat.chatId !== selectedChat);
            const currentChat = prevChats.find(chat => chat.chatId === selectedChat);
            return [currentChat, ...updatedChats];
          });
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setStatusMessage('Error al enviar el mensaje');
      }
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Modificamos el efecto para iniciar el chat con tutorId si existe y no hay chat seleccionado aún
  useEffect(() => {
    if (tutorId && selectedChat === null && chats.length > 0) {
      const existingChat = checkExistingChat(tutorId);
      if (existingChat) {
        setSelectedChat(existingChat.chatId);
        fetchMessages(existingChat.chatId);
      } else {
        startChatWithUser(tutorId);
      }
    }
  }, [tutorId, selectedChat, chats]); // Dependemos de chats para esperar a que se cargue antes de redirigir

  const filteredMessages = messages.filter((msg) => msg.content && msg.content.trim() !== '');

  return (
    <div className="chat-container">
            {isSmallscreen && (
        <button 
          className="show-history-button" 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18m-1 5v5l4.25 2.52l.77-1.28l-3.52-2.09V8z"/></svg>
          <span className="button-title">Chats</span>
        </button>
      )}

        <div className={`chat-history ${isHistoryOpen ? 'open' : ''}`}>
        <h2>Historial de Chats</h2>
        {chats.length > 0 ? (
          <ul>
            {chats.map((chat) => (
              <li key={chat.chatId} 
                  onClick={() => {
                    if (selectedChat !== chat.chatId) {
                      setSelectedChat(chat.chatId);
                      fetchMessages(chat.chatId);
                    }
                  }}
                  className={selectedChat === chat.chatId ? 'active' : ''} 
                  style={{ cursor: 'pointer' }}>
                <strong>{chat.otherUsername || 'Usuario desconocido'}</strong><br />
                <small>{chat.lastMessage}</small><br />
                <small>{new Date(chat.lastMessageTime).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : <p>No hay chats disponibles.</p>}
      </div>

      <div className="chat-content">
        {selectedChat ? (
          <>
            <div className="chat-messages" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
              {isLoadingMessages ? (
                <p>Cargando mensajes...</p>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg, index) => (
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
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escriba aquí" 
                className="chat-input" 
              />
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
