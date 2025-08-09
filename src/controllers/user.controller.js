import user from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import user from "../models/user.model.js";
import { json } from "express";
import { use } from "react";
import { set } from "mongoose";


// Register User Controller

const handleRegisterUser = asyncHandler(async(req,res) =>
    {
   
        const {username, email, fullname, password} = req.body;

        if([username, email, fullname, password].some((fields) => fields?.trim() === ""
        ))
        {
            throw new ApiError(400, "All fields are required")
        }


        // Check for existing user

       const existingUser = await user.findOne({$or: [{username, email}]});

       if(existingUser){
        throw new ApiError(409, "User Already Exists")
       }

       
       // Image file 
       const avatarFile = req.files?.avatar?.[0].path;
       const CoverimageFile = req.files?.coverimage?.[0].path;

       console.log(CoverimageFile)

       if(!avatarFile)
       {
        throw new ApiError(400, "Avatar File is required")
       }

    const avatar= await uploadOnCloudinary(avatarFile);
    const coverimage = await uploadOnCloudinary(CoverimageFile);


       if(!avatar)
       {
        throw new ApiError(400, "Avatar File required");
       }


      const MyUser =  await user.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()

      })


    const createdUser = await user.findById(MyUser._id).select(" -password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Error while Registering")
    }

    return res.status(201).json( new ApiResponse(200, createdUser, "Created User Sucessfully"))

})


// Login Controller Starts Here

const handleLoginUser = asyncHandler(async (req,res) =>
 {

    //  Req User from Body 
    // find the user 
    // password check
    //access token and refresh token 
    // send cookie

    const {username, email, password} = req.body;

    if(!username && !email)
    {
        throw new ApiError(400, "Username or Email is Required")
    }

   const checkUser = await user.findOne({$or: [{username}, {email}]})

   if(!checkUser)
   {
    throw new ApiError(404, "User Not Found");
   }

const isvalidPassword = await checkUser.isPasswordCorrect(password)

 if(!isvalidPassword)
    {
        throw new ApiError(401, "Invalid User Credentials")
    }

// Generate Access Token 

const accessToken = await checkUser.generateAccessToken();
const refreshToken = await checkUser.generateRefreshToken();

checkUser.refreshToken = refreshToken;
await checkUser.save({validateBeforeSave: false})

const loggedUser = await user.findById(checkUser._id).select('-refreshToken -password')


const options =
{
    httpOnly: true,
    secure: true
}

return res.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json( new ApiResponse(200, { data: loggedUser, accessToken, refreshToken

}, "User Logged in Sucessfully"))

})

 
// Logout Controller Starts Here

const handleLogout = asyncHandler(async (req,res) => {
   
    await user.findByIdAndUpdate(req.myUser._id, {
  $unset: { refreshToken: "" }
}, {new: true }) // this is not updating

const options ={ 
    httpOnly: true,  
    secure: true
}

return res.status(200).clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User Logged Out"))
})

const handleRefreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken)
    {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const myUser = await user.findById(decodeToken._id)
    
        if(!myUser)
        {
            throw new ApiError(401, "Invalid User")
        }
        
    
        if(incomingRefreshToken !== myUser?.refreshToken)
        {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options ={ 
        httpOnly: true,  
        secure: true
    }
    
    const accessToken = await myUser.generateAccessToken();
    const newrefreshToken = await myUser.generateRefreshToken();
    
    myUser.refreshToken = newrefreshToken;
    await myUser.save({validateBeforeSave: false})
    
    return res.status(200).cookie("accessToken",accessToken, options)
    .cookie("refreshToken",newrefreshToken, options)
    .json(new ApiResponse(200, {accessToken , refreshToken: newrefreshToken}, "AccessToken Refreshed"))
    } catch (error) {
        throw new ApiError(401, "Invalid or Expired Refresh Token");
    }
})

const handlePasswordChange = asyncHandler(async(req, res) =>{

    const {oldPassword, newPassword} = req.body;

    const myUser =  await user.findOne(req.myUser._id)
const isPasswordCorrect = await myUser.isPasswordCorrect(oldPassword)

if(!isPasswordCorrect)
{
    throw new ApiError(400, "Invalid Password")
}

myUser.password = newPassword;
await myUser.save({validateBeforeSave: false});

return res.status(200).json(new ApiResponse(200, "Password Changed Successfully"))
});



const getCurrentUser = asyncHandler(async(req, res) => {

  return res.status(200).json(new ApiResponse(200, req.myUser ,  "Current User"))
});


const handleUpdateUser = asyncHandler(async(req,res)=>{

    const {fullname, email} = req.body;

    if(!fullname || ! email)
    {
 throw new ApiError(400, "All Fields are Required")
    }

   const myUser =  await user.findByIdAndUpdate(req.myUser._id,
        {
            $set:{
                fullname,
                email
            }
        },
        
        { new: true } // this will return after updated ===> new data that is updated using this query
    ).select("-password") // will return user without password

return res.status(200).json(new ApiResponse(200, myUser, "User Updated Successfully"))
});


const handleAvatarUpdate = asyncHandler(async(req,res)=>{

    const avatarFile = req.file?.path;

    if(!avatarFile)
    {
        throw new ApiError(400,"Avatar File is required")
    }

  const avatar = await uploadOnCloudinary(avatarFile); // this is full object 

  if(!avatar)
  {
    throw new ApiError(400, "Avatar File Upload Error")
  }

  const myUser = await user.findByIdAndUpdate(req.myUser._id, {
     $set:{
                avatar: avatar.url
            }
  }, {new: true}).select("-password")
  

  return res.status(200).json(new ApiResponse(200, myUser, "Avatar Updated Successfully"))

});


const handleCoverImageUpdate = asyncHandler(async(req,res)=>{

    const coverImageFile = req.file?.path;

    if(!coverImageFile)
    {
        throw new ApiError(400,"Cover Image is required")
    }

  const coverImage = await uploadOnCloudinary(coverImageFile); // this is full object 

  if(!coverImage)
  {
    throw new ApiError(400, "Cover Image Upload Error")
  }

  const myUser = await user.findByIdAndUpdate(req.myUser._id, {
     $set:{
                coverimage: coverImage.url
            }
  }, {new: true}).select("-password")
  

  return res.status(200).json(new ApiResponse(200, myUser, "Cover Image Updated Successfully"))

});



export { handleRegisterUser, handleLoginUser, handleLogout, handleRefreshAccessToken,
     handlePasswordChange, handleUpdateUser, getCurrentUser, handleAvatarUpdate, handleCoverImageUpdate};