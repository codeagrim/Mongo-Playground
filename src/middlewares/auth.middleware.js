import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

export const VerifyJWT = asyncHandler(async (req, res, next) => {

   try {
    const token =  req.cookies?.accessToken || req.header("Authorization").replace("Bearer" , "");

    if(!token){
       throw new ApiError(401, "Unauthorized Request"); 
      }
      
      const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const myUser =  await user.findById(decodeToken._id).select('-refreshToken -password');
 
    if(!myUser)
    {
     throw new ApiError(401, "Invalid Access Token")
    }
 
 
    req.myUser = myUser;
    next();


   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token")
   }



})