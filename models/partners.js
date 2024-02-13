const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
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
      required: false,
      default:
        "https://res.cloudinary.com/hvd4lcwbb/image/upload/v1707073428/a6a7gpohbeczb0rtuavr.png",
      minLength: 2,
      maxLength: 255,
      trim: true,
    },
    page_link: {
      type: String,
      required: false,
      default: "N/A",
      minLength: 2,
      maxLength: 500,
      trim: true,
    },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

exports.Partner = Partner;
