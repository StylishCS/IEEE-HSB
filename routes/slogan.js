var express = require("express");
var router = express.Router();
const slogan = require("../controllers/sloganController");

router.route("/").post(slogan.addSlogan).get(slogan.getSlogans);
router
  .route("/:id")
  .patch(slogan.updateSlogan)
  .delete(slogan.deleteSlogan)
  .get(slogan.getSlogan);
module.exports = router;
