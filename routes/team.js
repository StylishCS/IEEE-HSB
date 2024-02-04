var express = require("express");
const { loginController, seed } = require("../controllers/teamAuthController");
var router = express.Router();

/* GET home page. */
router.post("/login", loginController);
router.get("/seed", seed);

module.exports = router;
