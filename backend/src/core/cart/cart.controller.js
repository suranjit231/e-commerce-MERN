import CartItemRepository from "./cart.repository.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";

export default class CartItemsController{
    constructor(){
        this.cartItemsRepository = new CartItemRepository();
    }

    //======= add new items in cart controller =======//
    async addToCart(req, res, next){
        try{
            const userId = req.userId;
            const { productId, quantity} = req.body;
           // console.log("req in add cart controller: ", req.body);
            if(!userId){
                throw new AppError("user credential is missing can't add in cart.", 404);
            }

            if(quantity<1){
                throw new AppError("quantity must be mininm 1.", 404);
            }

            const result = await this.cartItemsRepository.addToCart(
                {
                    userId:userId,
                    productId:productId,
                    quantity:Number(quantity)
                }
            )

            if(result?.success){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //====== get user cartItems ==========//
    async getUserCartItems(req, res, next){
        try{
            const userId = req.userId;
            if(!userId){
                throw new AppError("user credential is missing can't get carts.", 404)
            }

            const result = await this.cartItemsRepository.getUserCartItems(userId);
            if(result){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //======= increased cartItems controller =========//
    async increasedItemInCart(req, res, next){
        try{
            const userId = req.userId;
            const cartId = req.params.cartId;

            const result = await this.cartItemsRepository.increasedQuantityInCart(cartId, userId);
            if(result?.success){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //====== decreased items from cart ======//
    async decreasedItemFromCarts(req, res, next){

        try{
            const userId = req.userId;
            const cartId = req.params.cartId;

            const result = await this.cartItemsRepository.decreasedFromCart(cartId, userId);
            if(result?.success){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }

    }

    //======= removed items from cart ============//
    async removedItemsFromCart(req, res, next){
        try{
            const userId = req.userId;
            const cartId = req.params.cartId;

            const result = await this.cartItemsRepository.removedFromCart(cartId, userId);
            if(result?.success){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }

    }
}