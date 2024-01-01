import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "dpwqxymnb",
  api_key: "629565643928674",
  api_secret: "nl3pZ2PhAvwQgtLutIVseyaPLiw",
});

const uploadToCloudinary = async (buffer) => {
  try {
    const uploaded = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        (error, result) => {
          if (error) {
            console.log(error);
            reject(new Error("Failed to upload file to Cloudinary"));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
    return uploaded;
  } catch (error) {
    console.log("error inside uploadation" + error);
  }
};

export { uploadToCloudinary };
