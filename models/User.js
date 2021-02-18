import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["ACTIVE","BLOCKED","DELETED"],
        default:"ACTIVE"
    },
     location:{
        address:String,
        type:{
            type:String,
            default:"Point"
        },
        coordinates:[Number]
    },
    profilePic:{
        type:String,
        default:"https://tinyjpg.com/images/social/website.jpg"
    },
    mobileNumber:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});

userModel.index({location: "2dsphere"});
const User = mongoose.model("User",userModel);

export default User;