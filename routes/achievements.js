const express = require("express");
const router = express.Router();
const multer = require("multer");
const achievement = require("../controllers/achievementsController");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const paginatedResults = require("../middlewares/paginatedResults");
const { Achievement } = require("../models/achievements");

const fileUpload = multer();

router
  .route("/")
  .post(
    fileUpload.single("image"),
    uploadToCloudinary,
    achievement.addAchievement
  )
  .get(paginatedResults(Achievement), achievement.getAchievements);

router
  .route("/:id")
  .get(achievement.getAchievement)
  .patch(
    fileUpload.single("image"),
    uploadToCloudinary,
    achievement.updateAchievement
  )
  .delete(achievement.deleteAchievement);

module.exports = router;
