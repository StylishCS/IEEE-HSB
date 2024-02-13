const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
      trim: true,
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

exports.Achievement = Achievement;
