var express = require("express");
var router = express.Router();

const multer = require("multer");
const fileUpload = multer();
const {
  signupController,
  resendOTP,
  verifyUser,
  loginController,
} = require("../controllers/userAuthController");
const UserPrivileges = require("../middlewares/protect");

router.post("/signup", fileUpload.single("image"), signupController);
router.get("/resendOTP", UserPrivileges, resendOTP);
router.get("/verify", UserPrivileges, verifyUser);
router.post("/login", loginController);

module.exports = router;
