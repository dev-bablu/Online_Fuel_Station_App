import mongoose from "mongoose";

const vehicleModel = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    vehicleNumber:{
        type:String,
        maxLength:15,
        required:true
    },
    vehicleType:{
        type:String,
        enum:["PETROL","DIESEL","GAS"],
        required:true
    },
    modelName:{
        type:String,
        maxLength:95,
        required:true
    }
},{timestamps:true});

const Vehicle = mongoose.model("Vehicle",vehicleModel);

export default Vehicle;