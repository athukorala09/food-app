import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Voice Search සඳහා අලුත් state එකක්
    const url = "http://localhost:4000";

    useEffect(() => {
        const sessionCart = sessionStorage.getItem("cartItems");
        if (sessionCart) {
            setCartItems(JSON.parse(sessionCart));
        }
    }, []);

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCart = prev || {};
            const newCart = { ...currentCart, [itemId]: (currentCart[itemId] || 0) + 1 };
            sessionStorage.setItem("cartItems", JSON.stringify(newCart));
            return newCart;
        });
        if (token) await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCart = prev || {};
            let newCart;
            if (currentCart[itemId] > 1) {
                newCart = { ...currentCart, [itemId]: currentCart[itemId] - 1 };
            } else {
                const { [itemId]: removed, ...rest } = currentCart;
                newCart = rest;
            }
            sessionStorage.setItem("cartItems", JSON.stringify(newCart));
            return newCart;
        });
        if (token) await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    };

    const syncCartWithBackend = async (userToken) => {
        const sessionCart = JSON.parse(sessionStorage.getItem("cartItems"));
        if (sessionCart && Object.keys(sessionCart).length > 0) {
            for (const itemId in sessionCart) {
                for (let i = 0; i < sessionCart[itemId]; i++) {
                    await axios.post(url + "/api/cart/add", { itemId }, { headers: { token: userToken } });
                }
            }
            sessionStorage.removeItem("cartItems");
            loadCartData(userToken);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data.success) setFoodList(response.data.data);
        } catch (error) { console.error("Error fetching food list:", error); }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData || {});
        } catch (error) { setCartItems({}); }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list, cartItems, setCartItems, addToCart, removeFromCart,
        getTotalCartAmount, url, token, setToken, syncCartWithBackend,
        searchQuery, setSearchQuery // Voice Search 
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;