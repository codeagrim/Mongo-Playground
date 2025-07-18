import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express()

app.use(express.urlencoded({ extended: true }));

app.use(express.json());



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import router from "./routes/userRouter.js";

app.use('/api/v1/users', router)


export default app;
