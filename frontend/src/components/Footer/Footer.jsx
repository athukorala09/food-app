import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id="footer">
        <div className="footer-content"> 
        <div className="footer-content-left"> 
            <img src={assets.logo} alt="" />
            <p>"Craving your favorite meals? We bring fresh, delicious food straight from the kitchen to your doorstep in no time. Satisfy your hunger with just a click!"</p>
            <div className='footer-social-icons'>
                <img src={assets.facebook_icon} alt=''/>
                <img src={assets.twitter_icon} alt=''/>
                <img src={assets.linkedin_icon} alt=''/>

            </div>
        </div>
        <div className="footer-content-center"> 
            <h2>RESTUARANT</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
      
    </div>
    <div className="footer-content-right"> 
        <h2>GET IN THOUCH</h2>
        <ul>
            <li>0372266367</li>
            <li>contact@tomato.com</li>
            <li>Negambo Road,Dambadeniya</li>
        </ul>
        </div>
        </div>
        <hr/>
        <p className="footer-copyright">Copyright 2022 @ Tomato.com-All Right Reservesd</p>
        </div>
  )
}

export default Footer
