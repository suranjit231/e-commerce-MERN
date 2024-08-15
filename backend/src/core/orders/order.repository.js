import mongoose from "mongoose";
import cartItemModel from "../cart/cartSchema.js";
import orderModel from "./orderSchema.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import userModel from "../user/userSchema.js";

export default class OrderRepository {

    //============== Create Order ===============//
    async createOrder(userId) {
       
        try {
            //------ fetch users all carts items ----//

            const cartList = await cartItemModel.find({ user: userId }).populate("product");

            if (cartList.length === 0) {
                throw new AppError("No items in cart", 400);
            }

            //----- createing an array of total price list of each product ---//
            const totalPriceArray = cartList.map((item, i)=>{
                return item.product.price * item.quantity;
            });

            const grandTotal = totalPriceArray.reduce((acc, price)=> acc + price ,0);

            const products = cartList.map((item, i)=>{
                return{
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                }
            });

            const newOrder = new orderModel({
                user:userId,
                products:products,
                totalPrice:grandTotal,
            });

            const savedOrder = await newOrder.save();
            //----- clear the cart docs-----//
            await cartItemModel.deleteMany({user:userId});

            //---- clear user cart reference and push orderId in orders list array ----//
            await userModel.updateOne(
                {_id:userId},

                { $push:{orders:savedOrder._id}, $set:{cartItems:[]}}
            );

             // Populate product info in the saved order
            const populatedOrder = await orderModel.findById(savedOrder._id).populate({
                path: 'products.product',
                model: 'Product'
            });

            return {success:true, message:"Your order is done suceefully", order:populatedOrder};

            
        } catch (error) {
           
            console.error("Error in create order repo: ", error);
            throw error;
        }
    }


    //======== get users orders ==============//
    async getUserOrders(userId){
        try{

           
            const orders = await orderModel.find({user:userId}).populate({
                path: 'products.product',
                model: 'Product'
            });

            

            if(orders?.length>0){
                return {success:true, message:"Your order is fetch successfullY", orders:orders};

            }else{
                return {success:false, message:"You haven't any order yet.", orders:[]};
            }

        }catch(error){
            console.error("Error in create order repo: ", error);
            throw error;
        }
    }
}































//============== Create Order with transaction ===============//


//  async function createOrder(userId) {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const cartList = await cartItemModel.find({ user: userId }).populate("product");

//         if (cartList.length === 0) {
//             throw new AppError("No items in cart", 400);
//         }

//         const totalPriceArray = cartList.map(item => item.product.price * item.quantity);
//         const grandTotal = totalPriceArray.reduce((acc, curr) => acc + curr, 0);

//         const products = cartList.map(item => ({
//             product: item.product._id,
//             quantity: item.quantity,
//             price: item.product.price
//         }));

//         const newOrder = new orderModel({
//             user: userId,
//             products: products,
//             totalPrice: grandTotal
//         });

//         await newOrder.save({ session });

//         // Delete cart items
//         await cartItemModel.deleteMany({ user: userId }, { session });

//         // Add order ID to user
//         await userModel.updateOne(
//             { _id: userId },
//             { $push: { orders: newOrder._id } },
//             { session }
//         );

//         await session.commitTransaction();
//         session.endSession();

//         return newOrder;
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error("Error in create order repo: ", error);
//         throw error;
//     }
// }