import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


// IIFE given by cloudinary


// Cbut we did in Chai Code Configuration with cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload on Cloudinary

async function uploadOnCloudinary(FilePath) {
  try {
    if (!FilePath) {
      return null; // return error message also
    }

    const uploadResponse = await cloudinary.uploader
      .upload(FilePath,{
          resource_type: "auto",
        })
// file is Uploaded
    fs.unlinkSync(FilePath)
    return uploadResponse;


  } catch(error) {
    fs.unlinkSync(FilePath) // remove the temp files as the file operation failed
    console.log(error);
    return null;
  }
}

export {uploadOnCloudinary}