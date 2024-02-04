const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  role: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  committee: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  image: {
    type: String,
    required: false,
    default: "https://res.cloudinary.com/hvd4lcwbb/image/upload/v1707073428/a6a7gpohbeczb0rtuavr.png",
    minLength: 2,
    maxLength: 255,
  },
  linkedin: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 255,
  },
  github: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 255,
  },
  faculty: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  phone: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
});

const Team = mongoose.model("Team", teamSchema);

exports.Team = Team;