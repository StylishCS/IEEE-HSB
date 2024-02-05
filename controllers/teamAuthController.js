const jwt = require("jsonwebtoken");
const { Team } = require("../models/Team");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require('path');
const fs = require('fs');

async function loginController(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json("Invalid Credentials");
    }
    if(!req.params.role){
      return res.status(400).json("Please select your role first");
    }
    const user = await Team.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("Wrong Email or Password");
    }
    if (user.role !== req.params.role) {
      return res.status(401).json("FORBIDDEN");
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(404).json("Wrong Email or Password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 2);
    const formattedExpirationTime = expirationTime.toUTCString();
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;
    return res
      .status(200)
      .setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Expires=${formattedExpirationTime}`
      )
      .json(userWithoutPassword._doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function returnAllUsers(req, res) {
  try {
    const users = await Team.find();
    if (!users[0]) {
      return res.status(404).json("No data found");
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function createTeamMember(req, res) {
  try {
    // req.body => name, email, role, committee
    // auto generate password
    // send mail with new password
    // user login and update his profile
    // if (
    //   !req.body.email ||
    //   !req.body.name ||
    //   !req.body.role ||
    //   !req.body.committee
    // ) {
    //   return res
    //     .status(400)
    //     .json("Please enter email, name, role and committee Properly.");
    // }
    let user = await Team.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json("User already exist");
    }
    const randomString = Math.random().toString(36).slice(-8);
    user = new Team({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(randomString, 10),
      role: req.body.role,
      committee: req.body.committee,
    });
    const data = {
      name: user.name,
      email: user.email,
      password: randomString,
    };
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "mail-template",
      "index.ejs"
    );
    const fileContent = fs.readFileSync(filePath, "utf8");
    const modifiedEmailTemplate = ejs.render(fileContent, data);
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    let message = {
      from: "IEEE HSB",
      to: user.email,
      subject: "Welcome on board!",
      html: modifiedEmailTemplate,
    };
    await transporter.sendMail(message).catch((err) => {
      return res.status(400).json({ error: true, msg: "MAIL NOT SENT..." });
    });
    await user.save();

    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;

    return res.status(201).json({
      user: userWithoutPassword._doc,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function refreshToken(req, res) {
  try {
    return res.status(200).json(req.adminId);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  loginController,
  refreshToken,
  createTeamMember,
  returnAllUsers,
};
