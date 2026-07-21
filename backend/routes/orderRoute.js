import express from "express"
import authMiddleware from "../middleware/auth.js"
// 1. මෙතනට acceptOrder එක ඇතුළත් කරන්න
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, acceptOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/userorders", authMiddleware, userOrders)
orderRouter.get('/list', listOrders)
orderRouter.post("/status", updateStatus)

// 2. අලුත් Route එක මෙතනට එක් කරන්න
// වෙනස් කළ යුතු පේළිය:
orderRouter.post("/accept", acceptOrder); // authMiddleware එක ඉවත් කරන්න; 

export default orderRouter;