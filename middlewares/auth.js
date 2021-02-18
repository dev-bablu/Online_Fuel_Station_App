import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Fuel from "../models/Fuel.js"
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = async(req,res,next)=>{
    const { token } = req.headers;
    if(!token){
        req.isAuth = false;
        return next();
    }
    let decode;
    try {
        decode = jwt.verify(token,process.env.API_KEY); 
    } catch (error) {
       req.isAuth = false;
       return next(); 
    }
    if(!decode){
        req.isAuth=false;
        return next();
    }
    req.isAuth = true;
    let authorizedUser;
    try {
        authorizedUser=await User.findOne({_id:decode.id,email:decode.email,mobileNumber:decode.mobileNumber,status:"ACTIVE"});
    } catch (error) {
        console.log(error);
        return next();
    }
    if(!authorizedUser){
        return next();
    }
    req.userId = decode.id;
    next(); 
}

export const verifyPump = async(req,res,next)=>{
    const { token } = req.headers;
    if(!token){
        req.isAuth = false;
        return next();
    }
    let decode;
    try {
        decode = jwt.verify(token,process.env.API_KEY); 
    } catch (error) {
       req.isAuth = false;
       return next(); 
    }
    if(!decode){
        req.isAuth=false;
        return next();
    }
    req.isAuth = true;
    let authorizedPump;
    try {
        authorizedPump=await Fuel.findOne({_id:decode.id,stationName:decode.name,isRunning:true});
    } catch (error) {
        console.log(error);
        return next();
    }
    if(!authorizedPump){
        return next();
    }
    req.pumpId = decode.id;
    next(); 
}