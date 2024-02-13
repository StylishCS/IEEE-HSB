const mongoose = require("mongoose");

const sloganSchema = new mongoose.Schema(
  {
    body: {
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

const Slogan = mongoose.model("Slogan", sloganSchema);

exports.Slogan = Slogan;
