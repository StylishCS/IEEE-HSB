const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    season: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
  },
  { timestamps: true }
);

const Videos = mongoose.model("Videos", videosSchema);

exports.Videos = Videos;
