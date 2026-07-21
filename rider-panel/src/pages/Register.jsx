import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // අනිවාර්යයෙන්ම CSS එක ලින්ක් කරන්න

const Register = () => {
    const [data, setData] = useState({ name: "", phone: "", email: "", password: "" });
    const navigate = useNavigate();

    const onRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/rider/register", data);
            if (response.data.success) {
                alert("Registration Successful!");
                navigate("/login"); // රෙජිස්ටර් වුණාම ලොගින් පේජ් එකට යවන්න
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Error: Could not connect to server");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Rider Registration</h2>
                <form onSubmit={onRegister}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        onChange={(e) => setData({...data, name: e.target.value})} 
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        onChange={(e) => setData({...data, phone: e.target.value})} 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        onChange={(e) => setData({...data, email: e.target.value})} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setData({...data, password: e.target.value})} 
                        required 
                    />
                    <button type="submit" className="register-btn">Register</button>
                </form>

                <p className="login-link" style={{ textAlign: 'center', marginTop: '15px' }}>
    Already have an account? <Link to="/login" style={{ color: 'blue', textDecoration: 'none' }}>Login here</Link>
</p>
            </div>
        </div>
    );
};

export default Register;