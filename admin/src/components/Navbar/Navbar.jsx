import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt="Logo"/>
        
        
        <button 
            className="navbar-home-btn" 
            onClick={() => window.location.href = "http://localhost:5173/"}
        >
            ← Home
        </button>

        <img className='profile' src={assets.admin_image} alt="Admin Profile"/>
    </div>
  )
}

export default Navbar