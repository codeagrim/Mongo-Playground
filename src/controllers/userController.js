import user from "../models/user.model.js";


// Get Users
const handleGetAllUsers = async(req,res) =>
    {
    const Users = await user.find({});
    res.status(200).json(Users)
}


// Add Users
async function handleCreateUser(req,res)
 {
    try {
    const body = req.body;
    const createuser = await user.create({...body})
    res.status(201).json({message: "User Created", data: createuser});
    }

    catch (err) {
    console.error('Error in creating user:', err.message);

    res.status(500).json({
      message: 'Failed to create user',
      error: err.message,
    });
}
}


async function handleUpdateUserById(req,res) {
    const id = req.params.id;
    const body = req.body;

    const updateuser = await user.findByIdAndUpdate(id, body, {new: true, runValidators: true})
    res.json({ message: "User updated", data: updateuser });
}


export { handleGetAllUsers, handleCreateUser, handleUpdateUserById };