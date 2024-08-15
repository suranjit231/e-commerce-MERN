import userModel from "./userSchema.js";
import { hashedPassword, comparePassword } from "../../utility/passwordHashing.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";


//============ a reposiory class contains all the methods of user ==========//
export default class UserRepository{

    //======== user signup methods =======//
    async signup(userInfo){
        try{
            // const isAlreadyExist = await userModel.findOne({email:userInfo.email});

            // console.log("isAlreadyExist: ", isAlreadyExist);
            // //----- return error that user allready exist -----//
            // if(isAlreadyExist){
            //     throw new AppError("User email is already exist!", 400);
            // }

            //===== else check strong password and hashed the password =====//
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!strongPasswordRegex.test(userInfo.password)) {
                throw new AppError("Password must strong!", 400);
            }

            const passwordHashed = await hashedPassword(userInfo.password);
            userInfo.password = passwordHashed;

            const newUser = new userModel(userInfo);
            const savedUser = await newUser.save();

            return {success:true, message:"User signup successfully!", user:this.removePasswordField(savedUser)};

        }catch(error){
            throw error;
        }
      
    }


    //=========================== user signin reqpository =====================================//
    async signin(userInfo){
        try{
            const user = await userModel.findOne({email:userInfo.email});
            //----- if not user then return incorrect email -----//
            if(!user){
                throw new AppError("No user found with this email", 404);
            }

            const isCorrectPassword = await comparePassword(userInfo.password, user.password);
            if(!isCorrectPassword){
                throw new AppError("Incorrect password!", 401);
            }else{
                return {success:true, message:"User Login Sucessfulll!", user:this.removePasswordField(user)};
            }

        }catch(error){
            throw error;
        }
    }




      //=========== a utility function for removing password from user when return user =========//
      removePasswordField(user) {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

}