import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js"; 
import riderRouter from "./routes/riderRoute.js";
import http from "http";
import { Server } from "socket.io";
import foodModel from "./models/foodModel.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

connectDB();
console.log("API KEY Check:", process.env.GEMINI_API_KEY ? "Key Found" : "Key Missing");

// Gemini API Route (2026 Gemini 3.5 Flash මෝඩලය සමඟ යාවත්කාලීන කරන ලදී)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const foodList = await foodModel.find({});
        const menuString = foodList.map(food => `${food.name}: Rs. ${food.price}`).join(", ");
        
        const model = "gemini-3.5-flash"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `You are a helpful AI Chef assistant. Our menu: ${menuString}. 
                        Please mention all prices in Rs. 
                        If the user asks in Sinhala, reply in Sinhala. 
                        If the user asks in English, reply in English. 
                        User message: ${message}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data && data.candidates && data.candidates[0].content.parts[0].text) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            console.error("Gemini Response Error:", JSON.stringify(data, null, 2));
            res.status(500).json({ error: "Gemini API Error", details: data });
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Connection Failed", details: error.message });
    }
});

// අනෙකුත් Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/rider", riderRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

export { io };

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("acceptOrder", (orderId) => {
        io.emit("orderAccepted", orderId);
    });
});

server.listen(port, () => console.log(`Server Started on http://localhost:${port}`));