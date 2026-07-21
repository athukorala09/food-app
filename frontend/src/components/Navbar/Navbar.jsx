import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../Context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, setCartItems, setSearchQuery } = useContext(StoreContext);
  const navigate = useNavigate();

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event) => {
        setSearchQuery(event.results[0][0].transcript);
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("cartItems");
    setCartItems({});
    setToken("");
    navigate("/");
  };

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="logo" className="logo" />
      
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active menu-button" : "menu-button"}>home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active menu-button" : "menu-button"}>menu</a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active menu-button" : "menu-button"}>mobile-app</a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active menu-button" : "menu-button"}>contact us</a>
      </ul>

      <div className="navbar-right">
        {/* Rider Panel බොත්තම නැවතත් එකතු කළා */}
        <a href="http://localhost:5175" target="_blank" rel="noopener noreferrer" className="rider-panel-btn">
            🏍️ Are you our Rider?
        </a>

        {/* Voice Search බොත්තම */}
        <button onClick={startListening} className="mic-btn">
  🎙️ <span>Easy Search</span>
</button>
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="basket" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)} className="sign-in-btn">Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="orders" /><p>Orders</p></li>
              <li onClick={logout}><img src={assets.logout_icon} alt="logout" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;