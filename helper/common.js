import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_cloud_name,
    api_key: process.env.CLOUDINARY_api_key,
    api_secret: process.env.CLOUDINARY_api_secret
});
export const cloudImage = async (image) => {
    try {
        const upload = await cloudinary.v2.uploader.upload(image);
        if (upload) {
            return upload.secure_url;
        }
    } catch (error) {
        console.log(error);
    }

}

export const cloudVideo = async (video) => {
    try {
        const upload = await cloudinary.v2.uploader.upload(video,{resource_type:"video"});
        if (upload) {
            return upload.secure_url;
        }
    } catch (error) {
        console.log(error);
    }

}