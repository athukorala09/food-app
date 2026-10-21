import React, { useState, useContext, useEffect } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { StoreContext } from '../../components/Context/StoreContext'; 

const Home = () => {
  const [category, setCategory] = useState("All");
  const { searchQuery, setSearchQuery } = useContext(StoreContext); 

  // click the menu item ,start this function
  const handleCategoryChange = (newCategory) => {
    // 1. කලින් තිබූ Category එකම නම් "All" කරන්න, නැත්නම් අලුත් එක තෝරන්න
    setCategory(prev => prev === newCategory ? "All" : newCategory);
    // 2. clear the voice search 
    setSearchQuery(""); 
  };

  // Voice Search , Category  "All"  to Scroll 
  useEffect(() => {
    if (searchQuery !== "") {
      setCategory("All");
      const element = document.getElementById('food_display');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchQuery]);

  return (
    <div>
      <Header />
      
      <ExploreMenu category={category} setCategory={handleCategoryChange} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
}

export default Home;