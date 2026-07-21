import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setRiderToken }) => {
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

   const onLogin = async (e) => {
        e.preventDefault();

        // 1. ඇඩ්මින්ගේ details සඳහා විශේෂ පරීක්ෂාව
        if (data.email === "admin123@gmail.com" && data.password === "admin123") {
            localStorage.setItem("role", "admin"); // ඇඩ්මින් ලෙස රෝල් එක සෙට් කරන්න
            navigate("/register"); // රෙජිස්ටර් පේජ් එකට යවන්න
            return; // මෙතැනින් නවතින්න
        }

        // 2. සාමාන්‍ය රයිඩර් ලොගින් එක
        try {
            const response = await axios.post("http://localhost:4000/api/rider/login", data);
            
            if (response.data.success) {
                localStorage.setItem("riderToken", response.data.token);
                localStorage.setItem("riderName", response.data.rider.name);
                localStorage.setItem("role", "rider"); // රයිඩර් ලෙස රෝල් එක සෙට් කරන්න
                setRiderToken(response.data.token);
                navigate("/dashboard");
            } else {
                alert(response.data.message || "Login Failed!");
            }
        } catch (error) {
            console.error(error);
            alert("Error: Could not connect to server");
        }
    };

    return (
        <div className="login-container">
            {/* කාඩ් එකෙන් පිටතට ගත් Back බොත්තම */}
            <button 
                className="back-home-arrow" 
                onClick={() => window.location.href = "http://localhost:5173/"}
            >
                ← Back
            </button>

            <div className="login-card">
                <h2>Rider Login</h2>
                <form onSubmit={onLogin}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        onChange={(e) => setData({...data, email: e.target.value})} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setData({...data, password: e.target.value})} 
                        required 
                    />
                    <button type="submit" className="login-btn">Login</button>
                </form>
               <p className="register-link">
                    Are you a new rider? Access is currently restricted. Only authorized administrators can grant registration permissions. Please contact an administrator for further assistance.
                </p>
            </div>
        </div>
    );
};

export default Login;