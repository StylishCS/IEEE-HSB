var express = require("express");
var router = express.Router();

const multer = require("multer");
const fileUpload = multer();
const cloudinary = require("../utils/cloudinary");
const streamifier = require('streamifier');

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/test", fileUpload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      let result = await streamUpload(req);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
