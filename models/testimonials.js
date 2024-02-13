const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
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
    lastPosition: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

exports.Testimonial = Testimonial;
