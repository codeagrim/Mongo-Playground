import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {handleRegisterUser, handleLoginUser, handleLogout, handleRefreshAccessToken,
    handlePasswordChange, handleUpdateUser, getCurrentUser, handleAvatarUpdate, handleCoverImageUpdate
} from "../controllers/user.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post('/register', upload.fields(

    [{
            name: "avatar",
            maxCount: 1
    },{

        name: "coverimage",
        maxCount: 1

    }]

) ,handleRegisterUser)

router.post('/login', handleLoginUser)
router.post('/logout', VerifyJWT,  handleLogout)
router.post('/refresh-token',handleRefreshAccessToken )
router.post('/change-password', VerifyJWT, handlePasswordChange)
export default router;