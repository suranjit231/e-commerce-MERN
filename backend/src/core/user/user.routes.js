import express from "express";
import UserController from "./user.controller.js";
import auth from "../../middleware/jwtAuth.middleware.js";
import checkedLogin from "../../middleware/checkedLogin.js";

const userRouter = express.Router();
const userController = new UserController();


//===== hansle user signup request ======//
userRouter.post("/signup", (req,res,next)=>{
    userController.signup(req,res,next);
});

//==== handle user signin request =======//
userRouter.post("/signin", (req,res,next)=>{
    userController.signin(req,res,next);
})

//=== handle user logout request =========//
userRouter.get("/logout", auth, (req,res,next)=>{
    userController.logout(req, res, next);
});

//== check is loggedIn ===================//
userRouter.get("/isLogin", checkedLogin, (req,res)=>{
    console.log("User cheked loggin called!");
})

//==== testing for protected rotue ========//
userRouter.get("/protect", auth, (req, res, next)=>{
    console.log("protect userId", req.userId);
    return res.status(200).json({message:"Protect routes access"})

})





export default userRouter;