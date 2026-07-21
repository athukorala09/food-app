import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Details from './pages/Details';

const App = () => {
  // බ්‍රවුසරයේ "riderToken" එක පරීක්ෂා කිරීම
  const [riderToken, setRiderToken] = useState(localStorage.getItem("riderToken"));

  return (
    <BrowserRouter>
      <Routes>
        {/* රයිඩර් ලොගින්/රෙජිස්ටර් රවුට්ස් */}
        <Route path="/" element={!riderToken ? <Login setRiderToken={setRiderToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!riderToken ? <Login setRiderToken={setRiderToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />

        {/* ආරක්ෂිත රවුට්ස් (Dashboard & Details) */}
        <Route 
          path="/dashboard" 
          element={riderToken ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/details/:orderId" 
          element={riderToken ? <Details /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;