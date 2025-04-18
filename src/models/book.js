import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        default:0,
    }

},{timestamps:true});
const Book = mongoose.model("Book",bookSchema);
export default Book;