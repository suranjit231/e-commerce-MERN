import express from "express";
import OrderController from "./order.controller.js";

const orderRouter = express.Router();
const orderController = new OrderController();


//======= create new order router ======//
orderRouter.post("/createOrder", (req, res, next)=>{
    orderController.createOrder(req, res, next);
});

//====== get all users order ===========//
orderRouter.get("/getAll", (req, res, next)=>{
    orderController.getUserOrders(req, res, next);
});


export default orderRouter;