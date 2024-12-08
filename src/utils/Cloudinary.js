import {v2 as cloudinary} from "cloudinary";
//import exp from 'constants';
import fs from 'fs' // It is In-build Package in Node Js 


  
  // Configuration
  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
  });


  const uploadOnCloudinary= async (localFilePath)=>{
    try{
         if(!localFilePath) return null
         // upload the file on cloudinary
        const response =await cloudinary.uploader.upload(localFilePath, {
                       resource_type:"auto"
         })

         //file has been uploaded successfully
        //console.log("file is uploaded on cloudinary" ,response.url)
        fs.unlinkSync(localFilePath);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
  } 

  // Upload an Image
//   const uploadResult = await cloudinary.uploader.upload('',
//     {
//         public_id:'shoes',
//     }
//   )
//   .catch((error)=>{
//    console.log(error);
//   });
// console.log(uploadResult);

// Optimize delivery by resizing and applying auto-format and auto-quntiy
// const optimizeUrl= cloudinary.url('shoes',{
//     fetch_format:'auto',
//     quality:'auto'
// });
// console.log(optimizeUrl);

// Transform the image: auto-crop to square aspect_ratio

// const autoCropUrl= cloudinary.url('shoes',{
//   crop:'auto',
//   gravity:'auto',
//   width:500,
//   height:500,
// });
// console.log(autoCropUrl);

export {uploadOnCloudinary}