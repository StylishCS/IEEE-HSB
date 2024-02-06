const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

async function uploadToCloudinary(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // Attach Cloudinary result to the request object
    req.cloudinaryResult = result;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return res
      .status(500)
      .json({ error: "Error uploading file to Cloudinary" });
  }
}

module.exports = uploadToCloudinary;
