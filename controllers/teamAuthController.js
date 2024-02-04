const jwt = require("jsonwebtoken");
const { Team } = require("../models/Team");
const bcrypt = require("bcrypt");

async function loginController(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json("Invalid Credentials");
    }
    console.log(req.body.email);
    console.log(req.body.password);
    const user = await Team.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("Wrong Email or Password");
    }
    console.log(user.password);
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(404).json("Wrong Email or Password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;
    res.setHeader("Set-Cookie", `jwt=${token}; Path=/; SameSite=None`);
    return res
      .status(200)
      .json(userWithoutPassword._doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
//test
async function seed(req, res) {
  try {
    const user = new Team({
      name: "admin",
      email: "admin@admin.com",
      password: bcrypt.hashSync("admin", 10),
      committee: "test",
      faculty: "test",
      github: "test",
      linkedin: "test",
      phone: "test",
      role: "test",
    });
    await user.save();
    return res.status(200).json("seeded");
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { loginController, seed };
