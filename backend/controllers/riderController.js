import riderModel from "../models/riderModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

// JWT Token 
const createToken = (id) => {
    return jwt.sign({ id }, "your_secret_key_123", { expiresIn: '3d' });
};

// 1. Rider Registration
const registerRider = async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        const exists = await riderModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Rider already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRider = new riderModel({ 
            name, phone, email, password: hashedPassword 
        });
        
        await newRider.save();
        res.json({ success: true, message: "Rider Registered Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in Registration" });
    }
};

// 2. Rider Login
const loginRider = async (req, res) => {
    const { email, password } = req.body;
    try {
        const rider = await riderModel.findOne({ email });
        
        if (!rider) {
            return res.json({ success: false, message: "Rider not found" });
        }

        // check the password
        const isMatch = await bcrypt.compare(password, rider.password);
        
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(rider._id); // ඔබේ ටෝකන් එක සාදන ෆන්ක්ෂන් එක

        // importan part 
        res.json({ 
            success: true, 
            token, 
            rider: { 
                name: rider.name, 
                id: rider._id 
            } 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { registerRider, loginRider };