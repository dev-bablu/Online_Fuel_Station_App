import express from "express";
import { registerPump, getAllPumps, pumpLogin, checkBookings } from "../controllers/fuelController.js"
import { verifyPump } from "../middlewares/auth.js";

const router = express.Router();

//register pump POST request
// {
//     "name":"station1",
//     "address":"namkum",
//     "lat":23.3298,
//     "long":85.3766,
//     "petrol":74.05,
//     "petrolRebate":1.5
// }
router.post("/register", registerPump);


router.get("/list", getAllPumps)



// request for POST login Pump
// {
//     "identity":"Bhanu Petroleum"
// }
router.post("/login", pumpLogin);

//request for GET checkBookings
//Headers:token
router.get("/booking", verifyPump, checkBookings);
export default router;