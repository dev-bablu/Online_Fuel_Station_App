import express from "express";
import { registerUser ,loginUser, addVehicles , getConvenientPump ,booking} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();


// request for POST registere user
// {
//     "name":"Amit Sharma",
//     "mobile":"9987654321",
//     "email":"amitsharma@gmail.com",
//     "password":"Amit",
//     "address":"Namkum Ranchi",
//     "lat":23.3298,
//     "long":85.3766
// }
router.post("/register",registerUser);


// request for POST login user
// {
//     "identity":"amitsharma@gmail.com",
//     "password":"Amit"
// }
router.post("/login",loginUser);

//request for POST addVehicle 
//Headers:token
// {
//      "name":"Hyundai i20",
//     "number":"JH-01R-1235",
//     "model":"Hyundai I20 Sportz 1.5 MT Diesel",
//     "type":"DIESEL"
// }
router.post("/vehicle",verifyToken,addVehicles);

// request for GET nearestPump 
// Headers:token
router.get("/pumpList",verifyToken, getConvenientPump);

// request for POST booking 
// Headers:token
// {
//     "vehicleNumber":"JH-01R-1235",
//     "qty":5
// }
router.post("/booking",verifyToken,booking);

export default router;
