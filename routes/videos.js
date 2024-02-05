var express = require("express");
var router = express.Router();
const video = require("../controllers/videosController");

router.route("/").post(video.addVideo).get(video.getVideos);
router
  .route("/:id")
  .patch(video.updateVideo)
  .delete(video.deleteVideo)
  .get(video.getVideo);
module.exports = router;
