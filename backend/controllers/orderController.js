import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";
import paymentModel from "../models/paymentModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Placing user order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173"; 
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const exchangeRate = 336;
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.round((item.price / exchangeRate) * 100) 
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Charges" },
                unit_amount: Math.round((200 / exchangeRate) * 100) 
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Stripe/Order Error:", error);
        res.json({ success: false, message: "Error" });
    }
};

// 2. verifyOrder 
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body; 
    try {
        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(orderId, { 
                payment: true 
            });

            // Payment Model 
            const newPayment = new paymentModel({
                userId: order.userId,
                orderId: orderId,
                amount: order.amount,
                status: "Paid"
            });
            await newPayment.save(); 

            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not paid" });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.json({ success: false, message: "Error" });
    }
};

// 3. userOrders 
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("UserOrders Error:", error);
        res.json({ success: false, message: "Error" });
    }
};

// 4. Listing order for admin
const listOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("ListOrders Error:", error);
        res.json({ success: false, message: "Error" });
    }
};

// 5. Updating order status
const updateStatus = async(req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error("UpdateStatus Error:", error);
        res.json({ success: false, message: "Error" });
    }
};

// 6. Accept Order & Send SMS via Text.lk
const acceptOrder = async (req, res) => {
    try {
        const { orderId, phoneNumber } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status: "Accepted" });

        const response = await axios.post('https://app.text.lk/api/v3/sms/send', {
            recipient: phoneNumber,
            sender_id: 'TextLKDemo',
            message: "Order Accepted! Your rider is on the way to your location."
        }, {
            headers: {
                'Authorization': 'Bearer 6011|F7cw96n6M4zOOguurvcg4epwIOGOKjiEjDWBErGL81f6556c',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        res.json({ success: true, message: "Order Accepted & SMS Sent!" });
    } catch (error) {
        console.error("SMS Error Details:", error.message);
        res.json({ success: false, message: "SMS sending failed" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, acceptOrder };