import mongoose from "mongoose";

const ratingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure you have a User model defined elsewhere
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    comment: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const ratingModel = mongoose.model("Rating", ratingSchema);
export default ratingModel;
