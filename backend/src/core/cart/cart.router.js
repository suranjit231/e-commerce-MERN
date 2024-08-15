import express from "express";
import CartItemsController from "./cart.controller.js";

const cartRouter = express.Router();
const cartController = new CartItemsController();

//====== post req add to cart =====//
cartRouter.post("/addToCart", (req, res, next)=>{
    cartController.addToCart(req, res, next);
});

//===== get req all user cart ====//
cartRouter.get("/getAllCart", (req, res, next)=>{
    cartController.getUserCartItems(req, res, next);
});

//==== increased cart items api ====//
cartRouter.put("/increasedCart/:cartId", (req, res, next)=>{
    cartController.increasedItemInCart(req, res, next);
});

//===== decreased cart items api ====//
cartRouter.put("/decreasedCart/:cartId", (req, res, next)=>{
    cartController.decreasedItemFromCarts(req, res, next);
});

//===== removed items from cart api ====//
cartRouter.delete("/removedCart/:cartId", (req, res, next)=>{
    cartController.removedItemsFromCart(req, res, next);
})



export default cartRouter;
