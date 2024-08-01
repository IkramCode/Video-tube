import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded to Cloudinary:", response.url);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted:", localFilePath);
    } else {
      console.warn("Local file not found for deletion:", localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};



const deleteFromCloudinary = async (localFilePath) => {
  const publicId = localFilePath.split("/").pop().split(".")[0];

  await cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      console.error("Error deleting old avatar from Cloudinary:", error);
    } else {
      console.log("Old avatar deleted from Cloudinary:", result);
    }
  });
};

export { uploadOnCloudinary , deleteFromCloudinary};
