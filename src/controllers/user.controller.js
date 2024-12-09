import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens= async(userId)=>{
  try{
    //find the UserId   
    const user =await User.findById(userId)

    // genrate the token
    const accessToken= user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
  
    //add refreshToken in database
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave: false})

    //return the token
    return {accessToken, refreshToken}

  }catch(error){
  throw new ApiError(500, "Something Went Wrong While Generating Refresh and access Token");
}
}
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
  const {fullName, email, username, password}= req.body
  //console.log("email :",email);
//   if(fullName===""){
//     throw new ApiError(400, "fullname is required")
//   }

// Validation All Text and number Fields
if([fullName, email , username, password].some((field)=>
    field?.trim()==="")){
   throw new ApiError(400, "ALl fields are required")
}


// Check User Are Existed or not
const existedUser= await User.findOne(
    {$or:[{email, username}]})

//console.log(existedUser)

// if user are existed -
if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
}



// check avatar image
const avatarLocalPath =req.files?.avatar[0]?.path;
//const coverImageLocalPath =req.files?.coverImage[0]?.path;
let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath =req.files.coverImage[0].path
}

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
    avatar:avatar?.url,
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

return res.status(201).json(new ApiResponse(200, createUser, "User Registered Successfully"));

});

const loginUser = asyncHandler(async (req, res)=>{
  //TODO
  //req body -data
  // username or email
  // find the user
  // password check
  // access token and refresh token
  // send cookie
 
  const {email, username, password} = req.body

  // check username or email avalibale or not 
  if(!(username || email)){
    throw new ApiError(400, "Username or email is Required");
  }

  //find the username and email
  const user= await User.findOne({
    $or:[{email}, {username}]
  })

  // if user is not find
  if(!user){
    throw new ApiError(400, "User Does not exist")
  }
  
  // check password
  const isPasswordValid =await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401, "Invalid User Credentials");
  }

//All the accessToken and refreshToken
 const {accessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id)
 
//unvaild unwanted
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//send cookies token
const options ={
 httpOnly:true,
 secure:true
}
return res
.status(200)
.cookie("accessToken", accessToken,options)
.cookie("refreshToken", refreshToken, options)
.json( new ApiResponse(200,{
    user:loggedInUser, accessToken, refreshToken
  },
  "User Logged in Successfully"
 )
)
});

const logoutUser = asyncHandler(async(req, res)=>{
 await User.findOneAndUpdate(
    req.user._id,{
      $set:{refreshToken:undefined}
    },
    {
      new:true
    }
  ) 
  const options ={
    httpOnly:true,
    secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User Successfully Logout"))
});

const refreshAccessToken= asyncHandler(async(req, res)=>{
  const incomingRefreshToken =req.cookie.refreshToken||req.body.refreshToken
  if(incomingRefreshToken){
    throw new ApiError(401, "unauthorized request")
  }
 try {
   const decodedToken = jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   )
   const user= await User.findById(decodedToken?._id)
   if(!user){
     throw new ApiError(401, "Invalid Refresh to Token ")
   }
   if(incomingRefreshToken!== user?.refreshToken){
     throw new ApiError(401, "Refresh Token expired or used")
   }
 
  const options={
   httoOnly:true,
   secure:true
  }
 
  const{accessToken, newRefreshToken} =await generateAccessAndRefreshTokens(user._id)
  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
   new ApiResponse(
     200, {accessToken,
           refreshToken: newRefreshToken
     },
     "Access token Refreshed"
   )
  )
 } catch (error) {
   throw  new ApiError(401, error?.message || "Invalid Refresh Token")
 }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}