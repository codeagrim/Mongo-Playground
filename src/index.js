import app from "./app.js"
import dbconnect from "./db/db.js";
import dotenv from 'dotenv';
import router from "./routes/userRouter.js";

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

app.use('/users', router)