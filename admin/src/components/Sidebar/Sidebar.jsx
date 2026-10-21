import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        
        <NavLink to='/add' className='sidebar-option'>
          <div className="sidebar-icon-wrapper">
            <img src={assets.add_icon} alt="Add" />
          </div>
          <p>Add Items</p>
        </NavLink>
       
        <NavLink to='/list' className='sidebar-option'>
          <div className="sidebar-icon-wrapper">
            <img src={assets.order_icon} alt="List" />
          </div>
          <p>List Items</p>
        </NavLink>
        
        <NavLink to='/order' className='sidebar-option'>
          <div className="sidebar-icon-wrapper">
            <img src={assets.order_icon} alt="Orders" />
          </div>
          <p>Orders</p>
        </NavLink>

      </div> 
    </div> 
  )
}

export default Sidebar;