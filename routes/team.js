var express = require("express");
const {
  loginController,
  refreshToken,
  createTeamMember,
  getChairmans,
  returnAllUsers,
  getDirectors,
  getVolunteers,
  updateMemberController,
} = require("../controllers/teamAuthController");
const AdminPrivileges = require("../middlewares/isAdmin");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const multer = require("multer");
const fileUpload = multer();
var router = express.Router();



router.post("/login/:role", loginController);
router.get("/refreshToken", AdminPrivileges, refreshToken);
router.post("/createTeamMember", AdminPrivileges, createTeamMember);
router.get("/getChairmans", getChairmans);
router.get("/returnAllUsers", returnAllUsers);
router.get("/getDirectors", getDirectors);
router.get("/getVolunteers", getVolunteers);
router.patch(
  "/updateMember/:id",
  fileUpload.single("image"),
  uploadToCloudinary,
  updateMemberController
);
router.delete("/deleteMember/:id", AdminPrivileges, );

module.exports = router;
