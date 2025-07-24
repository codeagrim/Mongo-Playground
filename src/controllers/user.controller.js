import user from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";


// Register user Controller

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


// Add Users


const handleCreateUser = asyncHandler(async (req,res) =>
 {
    const body = req.body;
    const createuser = await user.create({...body})
    res.status(201).json({message: "User Created", data: createuser});
})


const handleUpdateUserById = asyncHandler(async (req,res) => {
    const id = req.params.id;
    const body = req.body;

    const updateuser = await user.findByIdAndUpdate(id, body, {new: true, runValidators: true})
    res.json({ message: "User updated", data: updateuser });
})


export { handleRegisterUser, handleCreateUser, handleUpdateUserById };