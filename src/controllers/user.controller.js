import user from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// Register user Controller

const handleRegisterUser = asyncHandler(async(req,res) =>
    {
    const Users = await user.find({});
    res.status(200).json(Users)
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