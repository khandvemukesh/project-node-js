import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// This setting using for config express middeware
const app = express();

// Use this setting for "Cross-Origin Resource Sharing"
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

// Data We Getting JSON , with from and body etc middleware setting
app.use(express.json({limit:"16kb"}))

// This setting for encoded url like - (special charchater is not convert in the  @ -%20 ) 
app.use(express.urlencoded({extended:true, limit:"16kb"})) 

// We use this setting for store static file save in public folder
app.use(express.static("public"))

// We use this setting for cookie is set in to user browser
app.use(cookieParser()) 

export{app}