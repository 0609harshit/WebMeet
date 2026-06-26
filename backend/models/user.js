import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name :{type:String, required:true},
    userName :{type:String, required:true, unique:true},
    hashPassword :{type:String, required:true},
    history :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Meeting"
        }
    ]
})
const User=mongoose.model("User", userschema);
export default User;