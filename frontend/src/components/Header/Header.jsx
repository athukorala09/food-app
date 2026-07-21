import React, { useState } from 'react';
import './Header.css';
import ChatBot from '../ChatBot';

const Header = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className='header'>
        
        {showChat && <ChatBot onClose={() => setShowChat(false)} />}

    
        <button className="ai-chat-fixed-btn" onClick={() => setShowChat(true)}>
             Ask Our AI Chef 👨‍🍳
        </button>

        <div className="header-contents">
            <h2>Order your favourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes craft with finest ingredients and culinary expertise.
                Our mission is to provide tasty and very clean food for customer....
            </p>
            <button onClick={() => document.getElementById('explore-menu').scrollIntoView({behavior: 'smooth'})}>
                View Menu
            </button>
        </div>
    </div>
  );
};

export default Header;