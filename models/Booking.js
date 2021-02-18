import mongoose from "mongoose";

const bookingModel = new mongoose.Schema({
    pumpId:{
        type:mongoose.Types.ObjectId,
        ref:"fuel",
        required:true
    },
    clientId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
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
    qtyInLtrs:{
        type:Number
    },
    amount:{
        type:String,
    },
    rebate:{
        type:String,
    },
    finalAmount:{
        type:String
    },
    fillingComplete:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const Booking = mongoose.model("booking",bookingModel);

export default Booking;