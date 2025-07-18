import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// IIFE given by cloudinary


// Cbut we did in Chai Code Configuration with cloudinary
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// Upload on Cloudinary

async function uploadOnCloudinary(FilePath) {
  try {
    if (!FilePath) {
      return null; // return error message also
    }

    const uploadResult = await cloudinary.uploader
      .upload(FilePath,{
          resource_type: "auto",
        })
// file is Uploaded
    console.log(`File Uploaded : ${uploadResult.url}`);
    return uploadResult;


  } catch(error) {
    fs.unlinkSync(FilePath) // remove the temp files as the file operation failed
    console.log(error);
    return null;
  }
}

export {uploadOnCloudinary}