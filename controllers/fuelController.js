import Fuel from "../models/Fuel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js";
dotenv.config();

export const registerPump = async (req, res) => {
    const { name, address, lat, long, petrol, petrolRebate, diesel, dieselRebate, gas, gasRebate } = req.body;
    let location = {
        address,
        type: "Point",
        coordinates: [lat, long]
    };
    let newPump = {
        stationName: name,
        location,
        petrol: {},
        diesel: {},
        gas: {}
    };
    petrol ? (newPump.petrol.pricePerLitre = petrol, newPump.petrol.available = true, newPump.petrol.rebatePercentage = petrolRebate ? petrolRebate : 0) : 0;
    diesel ? (newPump.diesel.pricePerLitre = diesel, newPump.diesel.available = true, newPump.diesel.rebatePercentage = dieselRebate ? dieselRebate : 0) : 0;
    gas ? (newPump.gas.pricePerLitre = gas, newPump.gas.available = true, newPump.gas.rebatePercentage = gasRebate ? gasRebate : 0) : 0;
    try {
        const findPump = await Fuel.findOne({ stationName: name, isRunning: true });
        if (findPump) {
            return res.send({ msg: `The ${name} fuel station already exists .` });
        }
        let pump = await new Fuel(newPump).save();
        if (pump) {
            res.send({ msg: `The ${name} fuel Station registered sussessfully !` });
        }
    } catch (error) {
        res.send({ msg: error })
    }
}

export const getAllPumps = async (req, res) => {
    const findAll = await Fuel.find({ isRunning: true });
    try {
        if (findAll.length) {
            res.send({ msg: "The List of all Fuel Pumps : ", data: findAll });
        }
    } catch (error) {
        res.send({ msg: "Something went wrong", error })
    }
}

export const pumpLogin = async (req, res) => {
    const { identity } = req.body;
    const findPump = await Fuel.findOne({ stationName: identity, isRunning: true });
    try {
        if (findPump) {
            const token = jwt.sign({ name: findPump.stationName, id: findPump._id }, process.env.API_KEY, { expiresIn: "24h" });
            res.send({ msg: `The  ${findPump.stationName} Fuel Pump login successully!`, token, expiresIn: "24hrs" });
            res.send({ msg: "Incorrect password ." });
        } else {
            res.send({ msg: "No such Fuel Pump exists!" })
        }
    } catch (error) {
        res.send({ msg: "Something went wrong !", error })
    }
}


export const checkBookings = async (req, res) => {
    const { isAuth, pumpId } = req;
    if (!isAuth) {
        return res.send({ msg: "Authentication Failed !" })
    }
    if (!pumpId) {
        return res.send({ msg: "No Such Registered Fuel Station found!" })
    }
    try {
        const list = await Booking.find({ pumpId, fillingComplete: false }).populate({ path: "clientId", select: "userName mobileNumber email " });
        if (!list.length) {
            return res.send({ msg: "No Pending Bookings Found !" })
        }
        res.send({ msg: "The list of pending bookings are :", list })
    } catch (error) {
        res.send({ msg: "Something went wrong .", error })
    }
}