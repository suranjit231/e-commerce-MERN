import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                min: 1,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
