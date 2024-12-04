// require('dontenv').config({path:'./env'})
import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./contents.js";
import connectDB from "./db/index.js";
import express from "express";


dotenv.config({
    path: './env'
})
const app=express();
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is runing at port : ${process.env.PORT}`);
    });
    app.on("error", (error)=>{
        console.log("ERROR:", error);
        throw error;
    });
})
.catch((err)=>{
    console.log("Mongo Db connection failed !!!", err)
})



// import mongoose from 'mongoose';
// import { DB_NAME } from './contents';
// import express from 'express';
// const app =express();
//(async ()=>{
//     try{
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error)=>{
//             console.log("ERROR:", error);
//             throw error;
//         });
//         app.listen(process.env.PORT,()=>{
//             console.log(`App Is Listen on Port ${process.env.PORT}`);
//         })
//     }catch(error){
//         console.log("Error", error);
//         throw error;
//     }
// })();