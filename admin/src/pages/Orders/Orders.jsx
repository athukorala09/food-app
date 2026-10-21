import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from "react-toastify"
import axios from "axios"
import { assets } from "../../assets/assets.js"

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Now path
  const isDashboardView = window.location.pathname === "/";

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    if (url) {
      fetchAllOrders();
    }
  }, [url])

  // 1. if you come the first page show the welcome card
  if (isDashboardView) {
    return (
      <div className='admin-welcome-page'>
        <div className='admin-profile-card'>
          <div className='admin-avatar-container'>
            <img src={assets.admin_image} alt="Admin Profile" className='admin-avatar' />
            <div className='status-indicator'></div>
          </div>
          
          <div className='admin-welcome-text'>
            <h2>Welcome Back, Admin! 👋</h2>
            <p className='admin-role'>Tomato Restaurant Management</p>
            <p className='admin-desc'>
              Manage your food items, monitor live customer orders, and control your restaurant dashboard seamlessly from one central place.
            </p>
          </div>

          <div className='admin-quick-stats'>
            <div className='stat-box'>
              <span className='stat-title'>Status</span>
              <span className='stat-value active'>Online 🚀</span>
            </div>
            <div className='stat-box'>
              <span className='stat-title'>Access Level</span>
              <span className='stat-value'>Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. show the order details
  return (
    <div className='order-page-container'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            
            <p>Items: {order.items.length}</p>
            <p>Rs.{order.amount}</p>
            
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;