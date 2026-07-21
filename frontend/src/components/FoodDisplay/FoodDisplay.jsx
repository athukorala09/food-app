import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery } = useContext(StoreContext);

  return (
    <div className='food_display' id='food_display'>
      <h2>Top dishes near you</h2>
      <div className='food_display_list'>
        {food_list.map((item, index) => {
          // check the password
          const matchCategory = category === "All" || category === item.category;
          const matchSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase());

          if (matchCategory && matchSearch) {
            return (
              <FoodItem 
                key={index} 
                id={item._id} 
                name={item.name} 
                description={item.description} 
                price={item.price} 
                image={item.image} 
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;