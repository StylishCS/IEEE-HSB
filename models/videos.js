const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Videos = mongoose.model("Videos", videosSchema);

exports.Videos = Videos;
