import React, { useState } from 'react';
import './RiderLogin.css';

const RiderLogin = () => {
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    console.log("Rider logging in with:", data);
  
    alert("Rider Login functionality will be connected soon!");
  };

  return (
    <div className='rider-login'>
      <form onSubmit={onLogin} className="rider-login-container">
        <h2>Rider Login</h2>
        <div className="rider-login-inputs">
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default RiderLogin;