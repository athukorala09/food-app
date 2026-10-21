import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you with our menu today?' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. show the message in UI
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    const userQuestion = input;
    setInput('');

    try {
      // 2. send to backend
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuestion })
      });

      const data = await response.json();

      // 3. AI answer show UI
      if (data.reply) {
        setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages([...newMessages, { sender: 'bot', text: "Sorry, I couldn't get an answer." }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { sender: 'bot', text: "Error connecting to AI server." }]);
    }
  };

  return (
    <div className="chatbot-popup">
      <div className="chat-header">
        <h4>AI Chef Assistant 👨‍🍳</h4>
        <button onClick={onClose}>x</button>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about our food..." 
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;