import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.middleware.js";

const auth = async(req, res, next)=>{
    try{

        const {jwtToken} = req.cookies;
       // console.log("auth token: ", jwtToken)
        if(!jwtToken){
            throw new AppError("Unauthorized! credential is missing!", 404)
        }

        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, data)=>{
            if(err){
                throw new AppError("UnAuthorized! login to continue", 401);
            }else{
                req.userId = data.userId;
                next();
            }
        })

    }catch(error){
        next(error);
    }
    

}


export default auth;