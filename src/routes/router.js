import express from "express";
import user from "../models/user.js";

const router = express.Router();

router.get('/', async (req,res) => {
    const Users = await user.find({});
    res.json(Users)
})

router.post('/', async (req,res) => {
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
});



export default router;