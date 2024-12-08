import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser= asyncHandler(async (req, res)=>{
  // get user details form frontend
  // validation - not empty
  // check if user exist username, email
  // check for image check for avtar
  // upload them to cloudinary
  // create user object create entry in db
  // remove password and refresh token field form response
  // check for user creation
  // return res
  const {fullname, email, username, password}= req.body
  //console.log("email :",email);
//   if(fullName===""){
//     throw new ApiError(400, "fullname is required")
//   }

// Validation All Text and number Fields
if([fullname, email , username, password].some((field)=>
    field?.trim()==="")){
   throw new ApiError(400, "ALl fields are required")
}


// Check User Are Existed or not
const existedUser= User.findOne(
    {$or:[{email, username}]})

console.log(existedUser)

// if user are existed -
if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
}



// check avatar image
const avatarLocalPath =req.files?.avatar[0]?.path;
const coverImageLocalPath =req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400, 'Avatar File is required');
}
const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError(400, "Avatar File is Required");
}

//Entry IN DataBase
 const user= await User.create({
    fullName,
    avatar:avatar,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })
  //
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //check we get or not
  if(!createUser){
    throw new ApiError(500, "Something went Wromg While Registering the User");
  }
  // What Api-response send data

return res.status(201).json(
    new ApiResponse(200, createUser, "User Registered Successfully")
);

});
export {
    registerUser,
}