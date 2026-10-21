import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="navbar-left">
            <img className='logo' src={assets.logo} alt="Logo"/>
        </div>
        
        <div className="navbar-right">
            <button 
                className="navbar-home-btn" 
                onClick={() => window.location.href = "http://localhost:5173/"}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Back to Home</span>
            </button>

            <div className="admin-profile-container">
                <img className='profile' src={assets.admin_image} alt="Admin Profile"/>
                <div className="admin-status-dot"></div>
            </div>
        </div>
    </div>
  )
}

export default Navbar