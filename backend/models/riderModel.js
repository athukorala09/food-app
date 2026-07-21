import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "Available" } // Available/Busy
});

const riderModel = mongoose.models.rider || mongoose.model("rider", riderSchema);
export default riderModel;