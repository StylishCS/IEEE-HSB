const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/hvd4lcwbb/image/upload/v1707073428/a6a7gpohbeczb0rtuavr.png",
      trim: true,
    },
    page_link: {
      type: String,
      required: false,
      default: "N/A",
      trim: true,
    },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

exports.Partner = Partner;
