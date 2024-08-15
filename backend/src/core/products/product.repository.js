import productModel from "./product.schema.js";
import {AppError} from "../../middleware/errorHandler.middleware.js";
import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";

import { fileURLToPath } from 'url';

// Helper function to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//========= Product Reposit5ory class for contains methods for products operations ======//
export default class ProductRepository{

    async getAllProducts() {
        try {
            const products = await productModel.aggregate([
                {
                    $lookup: {
                        from: "ratings",
                        localField: "ratings",
                        foreignField: "_id",
                        as: "ratings"
                    }
                },
                {
                    $addFields: {
                        averageRating: {
                            $cond: {
                                if: { $gt: [{ $size: "$ratings" }, 0] },
                                then: { $divide: [{ $sum: "$ratings.rating" }, { $size: "$ratings" }] },
                                else: 0
                            }
                        },
                        totalRatings: { $size: "$ratings" }
                    }
                },
                {
                    $project: {
                        "ratings": 0 // Exclude the ratings field if not needed in the final response
                    }
                }
            ]);
    
            return { success: true, message: "Products fetched successfully!", products };
        } catch (error) {
            console.log("Error in fetching products: ", error);
            throw error;
        }
    }
    

    //===== add new products =============//
    async addProduct(productInfo){
        try{
            const newProduct = new productModel({
                name:productInfo.name,
                description:productInfo.description,
                price:Number(productInfo.price),
                images:productInfo.images,
                category:productInfo.category,
                stock:Number(productInfo.stock),
                brand:productInfo?.brand

            });

            const savedProduct = await newProduct.save();

            return {success:true, message:"Product is added.", product:savedProduct};

        }catch(error){
            throw error;
        }
    }

    
    //======= delete products ==========//
    async deleteProduct(productId) {
        try {
           
            const product = await productModel.findById(productId);
           
            if (!product) {
                
                throw new AppError("Product not found.", 404);
            }

            // console.log("Product exists, proceeding to delete images");

            // Remove images stored in ./uploads directory
            if (product.images && product.images.length > 0) {
                product.images.forEach(image => {
                    const imagePath = path.join(__dirname, '..', '..', '..', 'uploads', path.basename(image));
                    // console.log("Image path to delete: ", imagePath);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(`Error deleting image file: ${imagePath}`, err);
                        } else {
                            console.log(`Deleted image file: ${imagePath}`);
                        }
                    });
                });
            }

            // Delete the product from the database
            const deleteResult = await productModel.deleteOne({ _id: product._id });
           // console.log("deleteResult: ", deleteResult);

            if (deleteResult?.deletedCount === 1) {
                //console.log("Product deleted successfully");
                return { success: true, message: "Product is deleted successfully.", product: deleteResult };
            } else {
               // console.log("Product was not deleted");
                throw new AppError("Product deletion failed.", 500);
            }

        } catch (error) {
           // console.error("Error in deleteProduct: ", error);
            throw error;
        }
    }




    //===== get product by search ========//
    async getSearchProduct(searchText){
        try{
            const quey =  { name: { $regex: searchText, $options: 'i' } };
            const products = await productModel.find(quey);
            //console.log("products: ", products);

            if(products?.length>0){
                return {success:true, products};
            }else{
                throw new AppError("Product not found!", 404);
            }


        }catch(error){
           // console.log("error in search repo: ", error);
            throw error;
        }
    }


    //======== filter proucts repository ======//
    async filterProducts(query){
        try{
           // Add maxPrice to the filter criteria if it exists
           let filterCriteria = {};


            if (query.maxPrice) {
                filterCriteria.price = { $lte: query.maxPrice };
            }

            // Add category to the filter criteria if it exists and is not empty
            if (query.category && query.category.length > 0) {
                filterCriteria.category = { $in: query.category };
            }

            // Find products matching the filter criteria
            const products = await productModel.find(filterCriteria);
            //console.log("Filtered products: ", products);

            // Check if any products were found
            if (products.length > 0) {
                return { success: true, products };
            } else {
                throw new AppError("No products found matching the criteria!", 404);
            }

        }catch(error){
            console.log("error in filter products: ", error);
            throw error;
        }
    }


    //===== get single product by ID and populate rating ======//
async getSingleProduct(productId) {
    try {

      //  console.log("productId:" , productId);
        const productWithRatings = await productModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(productId) } },
            {
                $lookup: {
                    from: 'ratings',
                    localField: 'ratings',
                    foreignField: '_id',
                    as: 'ratings'
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: '$ratings.rating' }
                }
            }
        ]);

       // console.log("products with ratings: ", productWithRatings);

        if (!productWithRatings.length) {
            throw new AppError("Product not found!", 404);
        }

        const product = productWithRatings[0];

        return { success: true, product, averageRating: product.averageRating, ratings: product.ratings };

    } catch (error) {
        console.log(error);
        throw error;
    }
    }
}