import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://athukoralaupeksha5_db_user:3jbiq9hHhcr2vCO1@cluster0.36dl2fd.mongodb.net/food-del');
        console.log("DB Connected Successfully!");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
}