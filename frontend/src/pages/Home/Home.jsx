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

  // මෙනුවෙන් Category එකක් ක්ලික් කළ විට ක්‍රියාත්මක වන Function එක
  const handleCategoryChange = (newCategory) => {
    // 1. කලින් තිබූ Category එකම නම් "All" කරන්න, නැත්නම් අලුත් එක තෝරන්න
    setCategory(prev => prev === newCategory ? "All" : newCategory);
    // 2. අනිවාර්යයෙන්ම Voice Search එක clear කරන්න
    setSearchQuery(""); 
  };

  // Voice Search කළ විට Category එක "All" කර Scroll කිරීම
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
      {/* මෙතනදී handleCategoryChange function එක යවන්න */}
      <ExploreMenu category={category} setCategory={handleCategoryChange} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
}

export default Home;