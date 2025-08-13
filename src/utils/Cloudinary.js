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




async function deleteOnCloudinary(url) {
    

    // i know this may not be the best way to do
const parts = url.split('/');
  const public_id = parts[parts.length - 1].split('.')[0]; 
  

   try {
     const deleteImage = cloudinary.uploader.destroy(public_id);
     return deleteImage;
   } catch (err) {

    
    throw new Error("Failed to delete file from Cloudinary", err);
    
   }
}




export {uploadOnCloudinary, deleteOnCloudinary}