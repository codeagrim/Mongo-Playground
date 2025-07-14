import express from "express";
import {handleGetAllUsers, handleCreateUser, handleUpdateUserById} from "../controllers/user.controller.js";


const router = express.Router();

router.get('/', handleGetAllUsers)
router.post('/', handleCreateUser)
router.patch('/:id', handleUpdateUserById)
export default router;