import RatingRepository from "./rating.repository.js";

export default class RatingController{

    constructor(){
        this.ratingRepository = new RatingRepository();
    }

    //====== add new rating ======//
    async addRating(req, res, next){
        try{

            const userId = req.userId;
            const {productId, rating, comment} = req.body;

            const result = await this.ratingRepository.addNewRating(productId, userId, rating, comment);
            if(result?.success){
                res.status(201).json(result);
            }

        }catch(error){
            console.log("add rating conroller error: ", error);
            next(error);
        }
    }
}