import user from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";



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