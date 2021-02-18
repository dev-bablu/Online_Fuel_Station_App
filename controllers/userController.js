import User from "../models/User.js";
import Fuel from '../models/Fuel.js';
import Vehicle from "../models/Vehicles.js";
import Booking from "../models/Booking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
    const { name, mobile, email, password, address, lat, long } = req.body;
    let location = {
        address,
        type: "Point",
        coordinates: [lat, long]
    };
    let user = {
        userName: name, mobileNumber: mobile, email, password: bcrypt.hashSync(password), location
    }
    const findUSer = await User.findOne({ $or: [{ mobileNumber: mobile }, { email }], status: { $ne: "DELETED" } });
    try {
        if (findUSer) {
            if (findUSer.email == email) {
                return res.send({ msg: "The email ID already exists ." });
            } else {
                return res.send({ msg: "The mobile number already exists ." });
            }
        }
        const newUSer = await new User(user).save();
        if (newUSer) {
            res.send({ msg: "The User registered successfully !" });
        }
    } catch (error) {
        res.send({ msg: "Something went wrong", error })
    }
}

export const loginUser = async (req, res) => {
    const { identity, password } = req.body;
    const findUSer = await User.findOne({ $or: [{ mobileNumber: identity }, { email: identity }], status: { $ne: "DELETED" } });
    try {
        if (findUSer) {
            const checkPassword = bcrypt.compareSync(password, findUSer.password);
            if (checkPassword) {
                const token = jwt.sign({ email: findUSer.email, mobileNumber: findUSer.mobileNumber, id: findUSer._id }, process.env.API_KEY, { expiresIn: "24h" });

                res.send({ msg: "The user login successully!", token, expiresIn: "24hrs" });
            } else {
                res.send({ msg: "Incorrect password ." });
            }
        } else {
            res.send({ msg: "No such user exists!" })
        }
    } catch (error) {
        res.send({ msg: "Something went wrong !", error })
    }

}


export const addVehicles = async (req, res) => {
    const { isAuth, userId } = req;
    const { number, model, type } = req.body;
    if (!isAuth) {
        return res.send({ msg: "Unauthenticated User" });
    }
    if (!userId) {
        return res.send({ msg: "No such user found!" });
    }
    try {
        const getUser = await User.findById(userId);
        const findVehicle = await Vehicle.findOne({ userId: getUser._id, vehicleNumber: number });
        if (findVehicle) {
            return res.send({ msg: `The  Vehicle No. ${number} is already added .` });
        }
        const newVehicle = await new Vehicle({ userId: getUser._id, vehicleNumber: number, vehicleType: type, modelName: model }).save();
        if (newVehicle) {
            res.send({ msg: `The  Vehicle No. ${number} is added successfully .` })
        }
    } catch (error) {
        res.send(error)
    }
}


export const getConvenientPump = async (req, res) => {
    const { isAuth, userId } = req;
    if (!isAuth) {
        return res.send({ msg: "Unauthenticated User" })
    }
    if (!userId) {
        return res.send({ msg: "No such user found!" })
    }
    try {
        const getUser = await User.findById(userId);
        const lat = getUser.location.coordinates[0], long = getUser.location.coordinates[1];
        let aggregation = await Fuel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(lat), parseFloat(long)] },
                    distanceField: "dist.calculated",
                    maxDistance: 1000 * 0.7,
                    spherical: true
                }
            },
            { $match: { "diesel.available": true } }

        ]);
        return res.send({ aggregation })

    } catch (error) {
        res.send(error)
    }
}


export const booking = async (req, res) => {
    const { qty, vehicleNumber } = req.body;
    const { isAuth, userId } = req;
    if (!isAuth) {
        return res.send({ msg: "Authentication Failed !" })
    }
    if (!userId) {
        return res.send({ msg: "No such user found!" })
    }
    try {
        if (!qty || !vehicleNumber) {
            return res.send({ msg: "Fields are required !" });
        }
        const checkVechicle = await Vehicle.findOne({ userId, vehicleNumber });
        if (!checkVechicle) {
            return res.send({ msg: `No such vechicle added of vechicle no. ${vehicleNumber} .` });
        }
        const getUser = await User.findById(userId);
        const fuelType = checkVechicle.vehicleType.toLowerCase();
        const lat = getUser.location.coordinates[0], long = getUser.location.coordinates[1];
        let aggregation = await Fuel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(lat), parseFloat(long)] },
                    distanceField: "dist.calculated",
                    maxDistance: 1000 * 5,// 5 Kilometers
                    spherical: true
                }
            },
            { $match: { [`${fuelType}.available`]: true } }
        ]);
        if (!aggregation.length) {
            return res.send({ msg: "Sorry!, Booking could not be done ." });
        }
        const bestSearch = aggregation[0];
        const price = bestSearch[`${fuelType}`].pricePerLitre * Number(qty);
        const off = bestSearch[`${fuelType}`].rebatePercentage * 0.01 * price;
        const details = {
            Vechicle_Number: vehicleNumber,
            Fuel_Type: fuelType,
            Fuel_Station_Address: bestSearch.location.address,
            Fuel_Station_Name: bestSearch.stationName,
            Rate: `${bestSearch[`${fuelType}`].pricePerLitre} INR`,
            Distance: `${parseInt(bestSearch.dist.calculated) / 1000} kms`,
            Quantity: `${qty} ltrs`,
            Amount: `${price} INR`,
            Discount_Price: `${off} INR`,
            Final_Amount: `${price - off} INR`,
            Payment:"Cash"
        }
        const checkBooking = await Booking.findOne({pumpId:bestSearch._id,clientId:userId,vehicleNumber,fillingComplete:false});
        if(checkBooking){
            return res.send({msg:`The booking of ${vehicleNumber} is already pending .`,details})
        }
        const newbooking =await new Booking({
            pumpId:bestSearch._id,
            clientId:userId,
            vehicleNumber,
            vehicleType:checkVechicle.vehicleType,
            qtyInLtrs:qty,
            amount:`${price} INR`,
            rebate:`${off} INR`,
            finalAmount:`${price - off} INR`
        }).save();
        if(newbooking){
        res.send({ msg: "Booking Details are :", details });
        }
    } catch (error) {
        res.send({ msg: error })
    }
}