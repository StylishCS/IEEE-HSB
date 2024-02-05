var express = require("express");
const {
  loginController,
  refreshToken,
  createTeamMember,
} = require("../controllers/teamAuthController");
const AdminPrivileges = require("../middlewares/isAdmin");
var router = express.Router();

router.post("/login/:role", loginController);
router.get("/refreshToken", AdminPrivileges, refreshToken);
router.post("/createTeamMember", AdminPrivileges, createTeamMember);
module.exports = router;
