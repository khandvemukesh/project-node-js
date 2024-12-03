import mongoose, {Schema} from 'mongoose' // package for create middleware schema(database)
import jwt from 'jsonwebtoken' //createing for token
import bcrypt from 'bcrypt'    //by the bcrypt hashpassword

const userSchema=new Schema({
                                username:{
                                    type:String,
                                    required:true,
                                    unique:true,
                                    lowercase:true,
                                    trim:true,
                                    index:true
                                },
                                email:{
                                    type:String,
                                    required:true,
                                    unique:true,
                                    lowercase:true,
                                    trim:true,
                                },
                                fullName:{
                                    type:String,
                                    required:true,
                                    unique:true,
                                    lowercase:true,
                                    trim:true,
                                    index:true
                                },
                                avatar:{
                                    type:String,
                                    required:true, 
                                },
                                coverImage:{
                                    type:String,
                                },
                                watchHistory:[
                                    {
                                        type:Schema.Types.ObjectId,
                                        ref:"Video"
                                    }
                                ],
                                password:{
                                    type:String,
                                    required:[true, 'Password Is Required']
                                },
                                refreshToken:{
                                    type:String
                                }
                                    
                    },{timestamps:true})

userSchema.pre("save", async function(next){
if(!this.isModified("password")) return next(); // if password is modified go next field
this.password=bcrypt.hash(this.password, 10) //passows hash pattern 
next()
})
//This code is compare the password
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken=function(){

   return jwt.sign(
        {
            _id:this.id,
            email: this.email,
            usename: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
              expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const user=mongoose.model("User",userSchema)
