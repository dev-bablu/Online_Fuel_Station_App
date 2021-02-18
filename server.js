import express from "express";
import dotenv from "dotenv";
import fuelRoute from "./routes/fuelRoute.js";
import userRoute from "./routes/userRoute.js";
import mediaRoute from "./mediaManagement/mediaRoutes.js"
import mongoose from "mongoose";
import bodyParser from "body-parser";


dotenv.config();
const app = express();
//**___________________________________________ BODY PARSER ____________________________________________________________ */
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
const PORT = process.env.PORT;
//**___________________________________________ ROUTES __________________________________________________________________ */
app.get("/",(req,res)=>{
  res.send("Welcome to the fuel station server.");
});
app.use("/fuel",fuelRoute);
app.use("/user",userRoute);
app.use("/media",mediaRoute);
//**_____________________________________________ CONNECTIVITY ____________________________________________________________ */
const dbConnect = await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true});
console.log("MongoDB Database is Connected !")
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
});
//** _______________________________________________________________________________________________________________________ */
