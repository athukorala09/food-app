import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../Context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext)
  
  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "", // Confirm Password සඳහා
    newPassword: "" 
  })

  // පාස්වර්ඩ් පෙන්වීම/සැඟවීම පාලනය කිරීමට
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // Confirm password සඳහා වෙනම toggle එකක්

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    
    // Sign Up අවස්ථාවේදී Password සහ Confirm Password සමාන දැයි පරීක්ෂා කිරීම
    if (currState === "Sign Up" && data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let newUrl = url;
    if (currState === "Login") {
        newUrl += "/api/user/login";
    } else if (currState === "Sign Up") {
        newUrl += "/api/user/register";
    } else {
        newUrl += "/api/user/reset-password";
    }

    try {
        const requestData = currState === "Forgot Password" 
            ? { email: data.email, newPassword: data.newPassword } 
            : data;

        const response = await axios.post(newUrl, requestData);

        if (response.data.success) {
            if (currState === "Forgot Password") {
                alert(response.data.message);
                setCurrState("Login"); 
            } else {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                
                if (response.data.role === "admin") {
                    window.location.replace("http://localhost:5174"); 
                } else {
                    setShowLogin(false); 
                    window.location.replace("/"); 
                }
            }
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        alert("Operation failed. Please check your connection.");
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className='login-popup-title'>
          <h2>{currState === "Forgot Password" ? "Reset Password" : currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        
        <div className='login-popup-inputs'>
          {currState === "Sign Up" && (
            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
          )}
          
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          
          {/* සාමාන්‍ය Login / Sign Up පාස්වර්ඩ් එක */}
          {currState !== "Forgot Password" && (
            <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
              <input 
                name="password" 
                onChange={onChangeHandler} 
                value={data.password} 
                type={showPassword ? "text" : "password"} 
                placeholder='Password' 
                required 
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <span 
                onClick={() => setShowPassword(prev => !prev)} 
                style={{ position: "absolute", right: "12px", cursor: "pointer", display: "flex", alignItems: "center", color: "#555" }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </span>
            </div>
          )}

          {/* Sign Up, Confirm Password*/}
          {currState === "Sign Up" && (
            <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
              <input 
                name="confirmPassword" 
                onChange={onChangeHandler} 
                value={data.confirmPassword} 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder='Confirm Password' 
                required 
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <span 
                onClick={() => setShowConfirmPassword(prev => !prev)} 
                style={{ position: "absolute", right: "12px", cursor: "pointer", display: "flex", alignItems: "center", color: "#555" }}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </span>
            </div>
          )}

          {/* Forgot Password */}
          {currState === "Forgot Password" && (
            <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
              <input 
                name="newPassword" 
                onChange={onChangeHandler} 
                value={data.newPassword} 
                type={showPassword ? "text" : "password"} 
                placeholder='Enter new password' 
                required 
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <span 
                onClick={() => setShowPassword(prev => !prev)} 
                style={{ position: "absolute", right: "12px", cursor: "pointer", display: "flex", alignItems: "center", color: "#555" }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </span>
            </div>
          )}
        </div>
        
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : currState === "Forgot Password" ? "Update Password" : "Login"}
        </button>

        {currState === "Login" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {currState === "Login" ? (
          <>
            <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
            <p style={{ marginTop: "5px" }}>Forgot password? <span onClick={() => setCurrState("Forgot Password")}>Reset here</span></p>
          </>
        ) : currState === "Sign Up" ? (
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        ) : (
          <p>Remember your password? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  )
}

export default LoginPopup