import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectMongodb from "./src/config/connectMongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./src/core/user/user.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";
import productRouter from "./src/core/products/product.router.js";
import auth from "./src/middleware/jwtAuth.middleware.js";
import cartRouter from "./src/core/cart/cart.router.js";
import orderRouter from "./src/core/orders/order.router.js";
import ratingRouter from "./src/core/rating/rating.router.js";




// -------- import module for file upload and serve static file ------//
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//======= creating server by invocking express ==========//
const app = express();

//====== used middleware for parsing req body and cookies =====//
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//====== setup cors =======//
const corsOptions = {
    origin: 'http://localhost:3000', // Adjust this to your frontend's origin
    credentials: true,
  };

  app.use(cors(corsOptions))

//======= setup differnt routes for diddrent feature ========//
app.use("/api/users", userRouter);

app.use("/api/products", productRouter);

app.use("/api/carts", auth, cartRouter);

app.use("/api/orders", auth,  orderRouter);

app.use("/api/ratings", ratingRouter);

//======== for the root route get request =========//
app.get("/", (req,res,next)=>{
    res.status(200).send("welcome to our e-commerce application!");

})


//======== error handler miidleware ================//
app.use(errorHandler);

const port = process.env.PORT || 3200;

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}`);
    connectMongodb();
})