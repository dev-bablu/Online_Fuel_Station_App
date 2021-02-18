import multer from "multer";
import { cloudImage, cloudVideo } from "../helper/common.js"
import fs from "fs";
export const uploadImage = async (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, "./mediaManagement/media/images") },
        filename: (req, file, cb) => { cb(null, file.originalname.replace(/.jpeg|.jpg|.png|.svg|\s/g, '') + "-" + new Date().getTime().toString() + ".jpg") }
    });
    const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 3 } }).single("file");
    upload(req, res, async (err) => {
        if (err) {
            return res.send("Error uploading file.");
        }
        const imageUrl = await cloudImage(req.file.path);
        fs.unlinkSync(req.file.path);
        if (imageUrl) {
            res.send({ msg: "File is uploaded", imageUrl });
        } else {
            res.send({ msg: "Error in uploading the image" })
        }
    })
}

export const uploadVideo = async (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, "./mediaManagement/media/videos") },
        filename: (req, file, cb) => { cb(null, file.originalname.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi|\s/g, '') + "-" + new Date().getTime().toString() + ".mp4") }
    });
    const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 100 } }).single("file");
    upload(req, res, async (err) => {
        if (err) {
            return res.send("Error uploading file.");
        }
        const imageUrl = await cloudVideo(req.file.path);
        fs.unlinkSync(req.file.path);
        if (imageUrl) {
            res.send({ msg: "File is uploaded", imageUrl });
        } else {
            res.send({ msg: "Error in uploading the image" })
        }
    })
}

export const uploadMany=async(req,res)=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, "./mediaManagement/media/uploads") },
        filename: (req, file, cb) => {
            cb(null, file.originalname.replace(/.jpeg|.pdf|.zip|.jpg|.png|.svg|\s/g, '') + "-" + new Date().getTime().toString() + `.${file.originalname.split(".")[1]}`) }
    });
    const upload=multer({storage}).fields([{name:"avatar"},{name:"icon"}]);
    // upload.fields([{name:"image",maxCount:1},{name:"icon",maxCount:1}]);
    upload(req,res, async(err)=>{
        if(err){
            return res.send("Error uploading Files.");
        }
        console.log(req.files);
        res.send(req.files);
    })
}