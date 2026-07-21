import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleAccept = async () => {
    await axios.post("http://localhost:4000/api/order/status", { orderId, status: "Accepted" });
    alert("Order Accepted!");
    navigate("/"); // ආපහු Dashboard එකට යනවා
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Order Details</h1>
      <p>Accepting Order: {orderId}</p>
      <button onClick={handleAccept} style={{ backgroundColor: 'green', color: 'white' }}>Confirm Accept</button>
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};
export default OrderDetails;