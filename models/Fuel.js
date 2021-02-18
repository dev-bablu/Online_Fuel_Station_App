import mongoose from "mongoose";

const fuelModel = new mongoose.Schema({
    stationName:{
        type:String,
        required:true
    },
    isRunning:{
        type:Boolean,
        default:true
    },
    location:{
        address:String,
        type:{
            type:String,
            default:"Point"
        },
        coordinates:[Number]
    },
    petrol:{
        available:{
            type:Boolean,
            default:false
        },
        pricePerLitre:{
            type:Number
        },
        rebatePercentage:{
            type:Number
        }
    },
    diesel:{
        available:{
            type:Boolean,
            default:false
        },
        pricePerLitre:{
            type:Number
        },
        rebatePercentage:{
            type:Number
        }
    },
    gas:{
        available:{
            type:Boolean,
            default:false
        },
        pricePerLitre:{
            type:Number
        },
        rebatePercentage:{
            type:Number
        }
    }
},{timestamps:true});

fuelModel.index({location: "2dsphere"});
const Fuel = mongoose.model("Fuel",fuelModel);

export default Fuel;