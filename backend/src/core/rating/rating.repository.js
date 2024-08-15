import ratingModel from "./ratingSchema.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import userModel from "../user/userSchema.js";
import productModel from "../products/product.schema.js";

export default class RatingRepository {

    //===== add new rating ==========//
    async addNewRating(productId, userId, ratingVal, comment) {
        try {
            // Check if user and product exist
            const user = await userModel.findById(userId);
            const product = await productModel.findById(productId);

            if (!user) {
                throw new AppError("User not found.", 404);
            }

            if (!product) {
                throw new AppError("Product not found.", 404);
            }

            // Check if the user has already rated this product
            let rating = await ratingModel.findOne({ user: userId, product: productId });
            let savedRating ;

            if (rating) {
                // Update existing rating
                if (comment) {
                    rating.comment = comment;
                }
                if (ratingVal) {
                    rating.rating = Number(ratingVal);
                }
                savedRating= await rating.save();
            } else {
                // Create new rating
                rating = new ratingModel({
                    user: userId,
                    product: productId,
                    comment: comment,
                    rating: Number(ratingVal),
                });
                savedRating= await rating.save();
                product.ratings.push(rating._id);
                await product.save();
            }

            // Calculate average rating and total number of ratings
            const ratings = await ratingModel.find({ product: productId });
            const totalRatings = ratings.length;
            const averageRating = totalRatings > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
                : 0;

            return {
                success: true,
                message: rating ? "Rating updated successfully." : "New rating added successfully.",
                totalRatings,
                averageRating,
                productId,
                rating:savedRating,
            };

        } catch (error) {
            throw error;
        }
    }
}
