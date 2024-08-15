import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
import { AppError } from "../../middleware/errorHandler.middleware.js";

//====== a controller class contains methods for user operation which communicate between userRouter and userRepository ===//

export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
    }

    //===== user signup controller ====//
    async signup(req,res,next){
        try{
            const {name, email, password} = req.body;
            if(!name || !email || !password){
                throw new AppError("Missing required user info!", 400);
            }

            const result = await this.userRepository.signup({name, email, password});
            if(result){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //===== user signin controller =============//
    async signin(req,res,next){
        try{
            const {email, password} = req.body;
            if(!email || !password){
                throw new AppError("Missing required user credential", 400);
            }

            const result = await this.userRepository.signin({email, password});
            if(result?.success){
                const token=jwt.sign({
                    userId:result.user._id,
                    email:result.user.email
                   }, process.env.JWT_SECRET, { expiresIn: '2h' });

                return res.status(200).cookie("jwtToken", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
                .json({success:true, user:result.user, token});
 
            }

        }catch(error){
           next(error);
        }
    }


    //========== user logout controller =================//
    async logout(req, res, next){
        try {
           
            res.clearCookie('jwtToken').status(200).send({message:"User logout sucessfully!"});
        } catch (error) {
            console.log("error logout: ", error)
        }
    }
}