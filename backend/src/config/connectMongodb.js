import mongoose from "mongoose";
import UserRepository from "../core/user/user.repository.js";
const userRepository = new UserRepository();

//====== Please note: To create a new admin as soon as MongoDB is connected, uncomment the code provided below and run it once. This will allow you to perform admin operations. ======//

const connectMongodb = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}/ecom-mern`);
        console.log("MongoDB connected successfully!");

        //====== Uncomment the code below and run once to create a new admin in your database for admin operations ======//
        
        // const admin = await userRepository.signup({
        //     name: "Rahul",
        //     email: "rahul123@gmail.com",
        //     password: "Rahul@123",
        //     role: "admin",
        // });

        // console.log("Admin created: ", admin);

        //====== After creating the admin, try to log in from the frontend using these credentials (email: "rahul123@gmail.com", password: "Rahul@123"). You will be redirected to the admin panel automatically. ======//

    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
};

export default connectMongodb;
