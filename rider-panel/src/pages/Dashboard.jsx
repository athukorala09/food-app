import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './Dashboard.css';

// Socket connection
const socket = io("http://localhost:4000");

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [riderName, setRiderName] = useState("");
  const navigate = useNavigate();

  // 1. පරණ සහ අලුත් ඇණවුම් දෙකම ගන්නා function එක
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    setRiderName(localStorage.getItem("riderName") || "Rider");
    
    // පැනලය ඕපන් කරපු ගමන් පරණ ඇණවුම් ටික ගන්න
    fetchAllOrders();

    const savedOrder = localStorage.getItem("activeOrder");
    if (savedOrder) {
      setActiveOrder(JSON.parse(savedOrder));
    }

    // Socket events
    socket.on("receiveOrder", (orderData) => {
      setOrders((prev) => [...prev, orderData]);
    });

    socket.on("orderAccepted", (acceptedOrderId) => {
      setOrders((prev) => prev.filter((order) => order.orderId !== acceptedOrderId));
    });

    return () => {
      socket.off("receiveOrder");
      socket.off("orderAccepted");
    };
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.post("http://localhost:4000/api/order/status", { orderId, status: newStatus });
      if (newStatus === "Delivered") {
        setActiveOrder(null);
        localStorage.removeItem("activeOrder");
      } else {
        const updatedOrder = { ...activeOrder, status: newStatus };
        setActiveOrder(updatedOrder);
        localStorage.setItem("activeOrder", JSON.stringify(updatedOrder));
      }
    } catch (error) { alert("Error!"); }
  };

 const handleLogout = () => {
    // 1. දත්ත මකා දමන්න
    localStorage.clear(); 
    
    // 2. ප්‍රධාන Home page එකට යන්න 
    // මෙතැන "/" යනු ඔබේ App එකේ ප්‍රධාන පිටුවයි.
    window.location.replace("/"); 
};

  return (
    <div className="dashboard-container">
      {/* Navbar කොටස */}
      <nav className="navbar">
        <div className="navbar-logo">
           <span>🚗</span> <span>🏍️</span> <h2>Rider Panel</h2>
        </div>
        <div className="rider-profile">
            <span style={{ marginRight: '10px' }}>Welcome, {riderName}</span>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Rider" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Active Order Box */}
      {activeOrder && (
        <div className="active-order-box">
          <h3>Your Current Delivery</h3>
          <p>Order ID: {activeOrder.orderId}</p>
          <div className="status-btns">
            <button onClick={() => updateStatus(activeOrder.orderId, "Picked Up")}>Picked Up</button>
            <button onClick={() => updateStatus(activeOrder.orderId, "Delivered")}>Delivered</button>
          </div>
        </div>
      )}

      {/* Orders List කොටස */}
      <h3>New Orders ({orders.length})</h3>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No new orders...</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId || order._id} className="order-card">
              <p><strong>📍 Order ID:</strong> {order.orderId || order._id}</p>
              
              <button 
                className="view-btn" 
                onClick={() => navigate(`/details/${order.orderId || order._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;