var express = require("express");
const {
  loginController,
  refreshToken,
  createTeamMember,
  getChairmans,
  returnAllUsers,
  getDirectors,
  getVolunteers,
} = require("../controllers/teamAuthController");
const AdminPrivileges = require("../middlewares/isAdmin");
var router = express.Router();

router.post("/login/:role", loginController);
router.get("/refreshToken", AdminPrivileges, refreshToken);
router.post("/createTeamMember", AdminPrivileges, createTeamMember);
router.get("/getChairmans", getChairmans);
router.get("/returnAllUsers", returnAllUsers);
router.get("/getDirectors", getDirectors);
router.get("/getVolunteers", getVolunteers);


module.exports = router;
