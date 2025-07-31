import user from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";


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
checkUser.save({validateBeforeSave: false})

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


export { handleRegisterUser, handleLoginUser, handleLogout };