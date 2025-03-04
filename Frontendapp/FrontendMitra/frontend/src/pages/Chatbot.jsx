import React, { useState, useRef, useEffect } from 'react';
import '../Chatbot.css';
import chat from '../assets/chat.svg'
import personheart from '../assets/personheart.svg'
import person from '../assets/person.svg'
import house from '../assets/house.svg'
import arrow from '../assets/arrow.svg'
import freepeek from '../assets/freepeek.jpeg'
import send from '../assets/send.svg'
import User from '../assets/User.png'


function Chatbot() {
  const [inputMessage, setInputMessage] = useState('');

  // Keep messages in state so we can update them dynamically
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message:
        'Heyy !!! What can I help you with? Consider me as your मित्र and just tell me about your ongoing life.',
      isFavorite: false,
    },
    {
      id: 2,
      sender: 'user',
      message:
        'Heyy !!! Rahul here! I`ve been feeling really overwhelmed lately. I don`t know how to handle everything.',
    },
    {
      id: 3,
      sender: 'ai',
      message:
        'I hear you. Managing stress can be tough. Would you like to talk about what`s been overwhelming you?',
      isFavorite: false,
    },
    {
      id: 4,
      sender: 'user',
      message:
        'That sounds like a lot. When everything feels too much, taking a step back can help. Have you tried breaking tasks into smaller steps or setting realistic goals?',
    },
  ]);

  // Reference to scrollable chat box
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // State for stress score (range: 0 to 1) coming from your backend
  const [stressScore, setStressScore] = useState(0);  
  // Nav items and chat categories (unchanged)
  const navItems = [
    { icon: chat, label: 'MINDchat', active: true },
    { icon: personheart, label: 'HealthCare', active: false },
    { icon: person, label: 'Welfare Test', active: false },
    { icon: person, label: 'Profile', active: false },
    { icon: house, label: 'Health Reports', active: false },
    { icon: house, label: 'Home', active: false },
    { icon: arrow, label: 'Logout', active: false },
  ];
  const chatCategories = ['Mental Peace', 'Stress Relief', 'Medicinal Guidance'];

  // Send message -> user message + delayed AI response
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const messageToSend = inputMessage;

    // Append user's message to the chat
    setMessages((prev) => [
    ...prev,
    { id: prev.length + 1, sender: 'user', message: messageToSend },
  ]);


    setInputMessage('');
  
    try {
    const response = await fetch('http://127.0.0.1:5000/api/v1/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageToSend }), // Use stored value
    });
  
      const data = await response.json();
      
      
      // Append AI's response to the chat
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: 'ai', message: data.reply },
      ]);
  
      if (data.sentiment_score !== undefined) {
        setStressScore(data.sentiment_score);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };
  

  return (
    <div className="container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h2 className="Mitra">MITRA</h2>
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className={item.active ? 'active' : ''}>
                <img
                  src={item.icon}
                  alt={`${item.label} Logo`}
                  className="menu-logo"
                />
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        
        {/* Mood Slider Container */}
        <div className="mood-slider-container">
          <div className="mood-line"></div>
          {/* The mood-circle's left position is set based on the stressScore */}
          <div
            className="mood-circle"
            id="moodCircle"
            style={{ left: `${stressScore * 100}%` }}
          ></div>
        </div>

        <div className="user-profile">
          <img src={User} alt="User Photo" className="profile-photo" />
          <div className="user-info">
            <p className="user-name">Rahul Shah</p>
            <p className="user-email">rahul@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Chat Section */}
      <section className="chat-container">
        <header>
          <i className="fas fa-comments"></i>
          <h2 className="Mindchat">MINDchat</h2>
        </header>
        {/* Scrollable chat box */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg) =>
            msg.sender === 'ai' ? (
              <div key={msg.id} className="chat ai">
                <p className="text">{msg.message}</p>
                <span className="heart">
                  <i className="far fa-heart"></i>
                </span>
              </div>
            ) : (
              <div key={msg.id} className="chat user">
                <img src={User} alt="User" />
                <p className="text">{msg.message}</p>
              </div>
            )
          )}
        </div>
        {/* Input area (remains fixed below) */}
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask me anything ..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="send-btn"  >
            <img src={send} alt="Arrow" />
          </button>
        </form>
      </section>
    </div>
  );
}

export default Chatbot;