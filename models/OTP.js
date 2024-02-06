const mongoose = require("mongoose");

const OTP_Schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
});

const OTP = mongoose.model("OTP", OTP_Schema);

exports.OTP = OTP;
