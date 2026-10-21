import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './Details.css'; 

const socket = io("http://localhost:4000");

const Details = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/order/list`);
        const selectedOrder = response.data.data.find(o => o._id === orderId);
        setOrder(selectedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleAccept = async () => {
    try {
        // 1. inform other riders via soket
        socket.emit("acceptOrder", orderId);
        
       //send sms to the backend
        await axios.post("http://localhost:4000/api/order/accept", {
            orderId: orderId,
            phoneNumber: order.address.phone 
        });

        // 3. store order details
        localStorage.setItem("activeOrder", JSON.stringify({
            orderId: order._id,
            amount: order.amount,
            status: "Accepted"
        }));

        alert("Order Accepted & SMS Sent to Customer!");
        navigate('/dashboard');
    } catch (error) {
        console.error("Acceptance Error:", error);
        alert("Failed to accept order. Please try again.");
    }
  };

  if (!order) return <div className="details-container">Loading details...</div>;

  return (
    <div className="details-container">
      <h2>Order Details</h2>
      <div className="order-info">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer:</strong> {order.address.firstName} {order.address.lastName}</p>
        <p><strong>Phone:</strong> {order.address.phone}</p>
        <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state}</p>
        <p><strong>Total Amount:</strong> Rs. {order.amount}</p>
        
        <div className="order-items">
            <h4>Items:</h4>
            {order.items.map((item, index) => (
                <p key={index}>{item.name} x {item.quantity}</p>
            ))}
        </div>
      </div>

      <div className="action-btns">
        <button onClick={handleAccept} className="accept-btn">Accept Order</button>
        <button onClick={() => navigate('/dashboard')} className="back-btn">Back</button>
      </div>
    </div>
  );
};

export default Details;