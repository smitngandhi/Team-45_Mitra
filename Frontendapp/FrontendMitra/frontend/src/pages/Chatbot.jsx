import React, { useState } from 'react';
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
  // Happiness range from 0..1
  const [happiness, setHappiness] = useState(0.5);

  // Convert happiness (0..1) to pointer angle (0..180 degrees)
  const pointerAngle = happiness * 180;

  // Update happiness on slider change
  const handleHappinessChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setHappiness(val);
    }
  };

  // Navigation items for the sidebar
  const navItems = [
    { icon: chat, label: 'MINDchat', active: true },
    { icon: personheart, label: 'HealthCare', active: false },
    { icon: person, label: 'Welfare Test', active: false },
    { icon: person, label: 'Profile', active: false },
    { icon: house, label: 'Health Reports', active: false },
    { icon: house, label: 'Home', active: false },
    { icon: arrow, label: 'Logout', active: false },
  ];

  // Chat categories for the sidebar
  const chatCategories = ['Mental Peace', 'Stress Relief', 'Medicinal Guidance'];

  return (
    <div className="container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h2 className="Mitra">MITRA</h2>

        {/* Navigation */}
        <nav>
          <ul>
            {navItems.map((item, idx) => (
              <li key={idx} className={item.active ? 'active' : ''}>
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

        {/* Chats */}
        <div className="chat-section">
          <h3 className="chats">
            Chats <span className="add-chat">+</span>
          </h3>
          <ul>
            {chatCategories.map((cat, index) => (
              <li key={index} className="chat-help">
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Happiness Meter & User Profile at Bottom */}
        <div className="happiness-container">
          {/* Semi-circle meter */}
          <div className="semi-circle-meter">
            {/* The colored arc from red->yellow->green */}
            <div className="meter-arc"></div>

            {/* The pointer that rotates from 0..180 deg */}
            <div
              className="pointer"
              style={{ transform: `rotate(${pointerAngle}deg)` }}
            >
              <div className="pointer-knob"></div>
            </div>

            {/* Center area with range slider */}
            <div className="meter-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={happiness}
                onChange={handleHappinessChange}
                className="happiness-range"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <img src={User} alt="User Photo" className="profile-photo" />
            <div className="user-info">
              <p className="user-name">Rahul Shah</p>
              <p className="user-email">rahul@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT SECTION: Centered Illustration & Text */}
      <section className="right-container">
        <header>
          <h2 className="Mindchat">MINDchat</h2>
        </header>

        <div className="hero-container">
          <img
            src={freepeek}
            alt="Mitra AI Bot"
            className="center-image"
          />
          <h1 className="hero-title">I’m Mitra, your AI Mental Health Companion</h1>
          <p className="hero-subtitle">
            I’m here to support your emotional health in any way I can!
          </p>

          {/* Ask me anything input */}
          <div className="ask-input-container">
            <input
              type="text"
              placeholder="Ask me anything ..."
              className="ask-input"
            />
            <button className="ask-button">Send</button>
          </div>

          {/* Suggestions row */}
          <div className="suggestions-row">
            <button className="suggestion-btn">Having relationship problems</button>
            <button className="suggestion-btn">My toxic life</button>
            <button className="suggestion-btn">I am anxious today</button>
            <button className="suggestion-btn">I am bored</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Chatbot;