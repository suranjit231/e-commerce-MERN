import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    images: [String],
    category: String,
    stock: {
        type: Number,
        required: true
    },
    brand: String,
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }
    ]
}, { timestamps: true });

const productModel = mongoose.model("Product", productSchema);
export default productModel;
