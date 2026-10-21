import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected Successfully!");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
}