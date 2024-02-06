var express = require("express");
var router = express.Router();
const slogan = require("../controllers/sloganController");
const { Slogan } = require("../models/Slogan");
const AdminPrivileges = require("../middlewares/isAdmin");
const paginatedResults = require("../middlewares/paginatedResults");

router.use(AdminPrivileges);

router
  .route("/")
  .post(slogan.addSlogan)
  .get(paginatedResults(Slogan), slogan.getSlogans);
router
  .route("/:id")
  .patch(slogan.updateSlogan)
  .delete(slogan.deleteSlogan)
  .get(slogan.getSlogan);

module.exports = router;
