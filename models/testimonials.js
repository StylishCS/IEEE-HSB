const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    image: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/hvd4lcwbb/image/upload/v1707073428/a6a7gpohbeczb0rtuavr.png",
      minLength: 2,
      maxLength: 255,
    },
    lastPosition: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 500,
    },
    season: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 500,
    },
    comment: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 500,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

exports.Testimonial = Testimonial;
