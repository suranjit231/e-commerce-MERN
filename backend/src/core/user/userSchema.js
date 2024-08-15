import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },

    email: {
        type: String,
        unique: true,
        required: [true, "Email is required!"],
        match: [/.+\@.+\../, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    },

    avatar: {
        type: String
    },

    cartItems:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CartItem"
        }
    ],

    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ]
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
