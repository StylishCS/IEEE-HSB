const express = require("express");
const router = express.Router();
const multer = require("multer");
const partner = require("../controllers/partnersController");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const paginatedResults = require("../middlewares/paginatedResults");
const { Partner } = require("../models/partners");

const fileUpload = multer();

router.post(
  "/",
  fileUpload.single("image"),
  uploadToCloudinary,
  partner.addPartner
);

router.get("/", paginatedResults(Partner), partner.getPartners);

router
  .route("/:id")
  .patch(partner.updatePartner)
  .delete(partner.deletePartner)
  .get(partner.getPartner);

module.exports = router;
