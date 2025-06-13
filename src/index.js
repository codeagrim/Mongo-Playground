import express, { urlencoded } from "express";
import dbconnect from "./db/db.js";
import dotenv from 'dotenv';
import router from "./routes/router.js";


const app = express();

// dotenv config
dotenv.config();

// Db Connection
dbconnect().then(
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server Started on Port http://localhost:${process.env.PORT}`)
})
)
.catch((err)=>{
        console.log(`MongoDB ERROR ${err}`)
    
    })


app.use(express.urlencoded({ extended: true }));

app.use('/', router)