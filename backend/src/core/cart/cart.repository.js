import mongoose from "mongoose";
import cartItemModel from "./cartSchema.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import userModel from "../user/userSchema.js";
import productModel from "../products/product.schema.js";



//======== repository class contains methods for cart operations =======//
export default class CartItemRepository{

    //========== add to cart =======//
    async addToCart(cartInfo){
        try{

           
            const user = await userModel.findById(cartInfo.userId);
            const product = await productModel.findById(cartInfo.productId);
            if(!user){
                throw new AppError("UnAuthrized can't add in cart!", 404);
            }

            if(!product){
                throw new AppError("Product is out of stock!", 404);
            }

            //--- if product already in cart then increased the quantity ---//
            const isAlreadyInCart = await cartItemModel.findOne({user:cartInfo.userId, product:cartInfo.productId});
            if(isAlreadyInCart){
                isAlreadyInCart.quantity += cartInfo.quantity;
                const savedCart =await isAlreadyInCart.save();
                return {success:true, cart:savedCart, message:`${product.name} is added in cart.`};

            }else{
                //==== create a new cart docs ====//
                const newCart = new cartItemModel({
                    user: cartInfo.userId,
                    product: cartInfo.productId,
                    quantity: cartInfo.quantity
                });

                const savedCart = await newCart.save();
                user.cartItems.push(savedCart._id);
                await user.save();

                const cart = await cartItemModel.findById(savedCart._id).populate('product');

                return {success:true, cart:cart, message:`${product.name} is added in cart.`};

            }

        }catch(error){
            throw error;
        }
    }


    //======= get userCartItems =========//
    async getUserCartItems(userId){
        try{
            const cartItems = await cartItemModel.find({user:userId}).populate('product');

            //console.log(cartItems);
            if(cartItems?.length<1){
                return { success:false, message:"You haven't any products in cart!", carts:[]};

            }else{
                return { success:true, message:`You have ${cartItems.length} items in cart.`, carts:cartItems};
            }

        }catch(error){
            throw error;
        }
    }

    //======== increased quantity in cart ======//
    async increasedQuantityInCart(cartId, userId){
        try{
            const cartItem = await cartItemModel.findOne({_id:cartId, user:userId});
            if(!cartItem){
                throw new AppError("Items not found.", 404);
            }

            cartItem.quantity += 1 ;
            const savedCart = await cartItem.save();

            return {success:true, message:"Items added in cart.", cart:savedCart};

        }catch(error){
            throw error;
        }
    }

    //======== decreaded from cart ==========//
    async decreasedFromCart(cartId, userId){
        try{

            const cartItem = await cartItemModel.findOne({_id:cartId, user:userId}).populate('product');
            if(!cartItem){
                throw new AppError("Items not found.", 404);
            }

            if(cartItem.quantity===1){
                await cartItemModel.deleteOne({_id:cartId, user:userId});
                return { success:true, message:"Items is removed from cart"};

            }else{

                cartItem.quantity -= 1 ;
                const savedCart = await cartItem.save();
                return {success:true, message:`${cartItem.product.name} is deduct from cart.`, cart:savedCart};
    
            }

        }catch(error){
            throw error;
        }
    }

    //======== removed items from cart ===========//
    async removedFromCart(cartId, userId){
        try{
            const deleteResult = await cartItemModel.deleteOne({_id:cartId, user:userId});
            if(deleteResult.deletedCount === 1){
                return {success:true, message:"Product is removed from your cart."};

            }else{
                throw new AppError("You are not authrized to removed it from the cart.", 404);
            }

        }catch(error){
            throw error;
        }
    }
}