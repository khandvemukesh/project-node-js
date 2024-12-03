import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const videoSchema=new Schema({
   videoFile:{
    type:String,
    required:true
   },
   thumbnail:{
    type:String, //Cloudnary
    required:true
   },
   owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
   },
   title:{
    type:String,
    required:true
   },
   description:{
    type:String,
   },
   duration:{
    type:String,
   },
   views:{
    type:Number,
    default:0
   },
   isPublished:{
    type:boolean,
    default:true
   }

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)
export const video=mongoose.model("Video",videoSchema)