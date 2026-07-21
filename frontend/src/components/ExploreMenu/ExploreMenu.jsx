import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>"Fresh ingredients, bold flavors, and love in every bite. Take a look at our menu and find your next favorite dish!"</p>
      <div className='explore-menu-list'>
        {menu_list.map((item, index) => {
          return (
            // Home.jsx handleCategoryChange 
            <div 
              onClick={() => setCategory(item.menu_name)} 
              key={index} 
              className='explore-menu-list-item'
            >
              <img 
                className={category === item.menu_name ? "active" : ""} 
                src={item.menu_image} 
                alt="" 
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreMenu;