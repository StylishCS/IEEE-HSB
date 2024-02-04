var express = require("express");
var router = express.Router();

const upload = require("../utils/uploadImage");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/test", upload.single("image"), (req, res) => {
  try {
    return res
      .status(200)
      .send(
        "https://ieee-backend-06597876c603.herokuapp.com/" + req.file.filename
      );
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
