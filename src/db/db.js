import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const dbconnect = async() =>
{

    try {
      const dbconnectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB Connected : DB HOST = ${dbconnectInstance.connection.host}`)
    } catch (error) {
        console.log("Error in DB Connection", error)
        process.exit(1)
    }
}


export default dbconnect