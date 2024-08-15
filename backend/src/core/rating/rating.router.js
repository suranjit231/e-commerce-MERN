import express from "express";
import RatingController from "./rating.controller.js";
import auth from "../../middleware/jwtAuth.middleware.js"

const ratingRouter = express.Router();
const ratingController = new RatingController();

//===== add new rating ======//
ratingRouter.post("/addRating", auth, (req, res, next)=>{
    ratingController.addRating(req, res, next);
});



export default ratingRouter;
