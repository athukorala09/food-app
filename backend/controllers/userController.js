import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "random#secret");
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        // check admin
        const isAdmin = (email === "admin123@gmail.com"); 

        res.json({ 
            success: true, 
            token, 
            role: isAdmin ? "admin" : "user" 
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" });
        }
        
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });
        
        const user = await newUser.save();
        const token = createToken(user._id);
        
        res.json({ success: true, token, role: "user" }); 
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Not successful" });
    }
};

// Reset / Forgot Password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist with this email" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter strong password (at least 8 characters)" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully! Please login with your new password." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating password" });
    }
};

// Export
export { loginUser, registerUser, resetPassword };