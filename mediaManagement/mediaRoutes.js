import express from "express";
import {uploadImage,uploadVideo ,uploadMany } from "../mediaManagement/mediaController.js";
const mediaRoute= express.Router();
mediaRoute.post('/image',uploadImage);
mediaRoute.post('/video',uploadVideo);
mediaRoute.post('/many',uploadMany);
export default mediaRoute;