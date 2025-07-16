import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {handleRegisterUser, handleCreateUser, handleUpdateUserById} from "../controllers/user.controller.js";


const router = express.Router();

router.get('/register', upload.fields(

    [{
            name: "avatar",
            maxCount: 1
    },{

        name: "coverimage",
        maxCount: 1

    }]

) ,handleRegisterUser)
router.post('/', handleCreateUser)
router.patch('/:id', handleUpdateUserById)
export default router;