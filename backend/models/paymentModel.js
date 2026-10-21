import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String }, 
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);
export default paymentModel;