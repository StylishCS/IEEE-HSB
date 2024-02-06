const { User } = require("../models/User");
const { OTP } = require("../models/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

async function signupController(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json("User already exist");
    }
    let image;
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      let result = await streamUpload(req);
      image = result.secure_url;
      user = new User({
        name: req.body.name,
        email: req.body.email,
        image: image,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10),
      });
    } else {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10),
      });
    }
    await user.save();
    await OTP.deleteMany({ email: user.email });
    const d = new Date();
    d.setMinutes(d.getMinutes());
    const d2 = new Date();
    d2.setMinutes(d2.getMinutes() + 5);
    let otp = Math.floor(1000 + Math.random() * 9000);
    let OTP_Obj = new OTP({
      code: await bcrypt.hash(String(otp), 10),
      email: user.email,
      createdAt: Number(d),
      expiresAt: Number(d2),
      verified: false,
    });
    await OTP_Obj.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const data = {
      name: user.name,
      email: user.email,
      otp: otp,
    };
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "mail-template",
      "index2.ejs"
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
      subject: "Greeting!",
      html: modifiedEmailTemplate,
    };
    await transporter.sendMail(message).catch((err) => {
      throw err;
    });

    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;

    return res.status(201).json({
      user: userWithoutPassword._doc,
      token: token,
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

async function resendOTP(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "user not found.." });
    }
    await OTP.deleteMany({ email: user.email });
    let otp = Math.floor(1000 + Math.random() * 9000);
    const d = new Date();
    d.setMinutes(d.getMinutes());
    const d2 = new Date();
    d2.setMinutes(d2.getMinutes() + 1);

    let OTP_Obj = new OTP({
      code: await bcrypt.hash(String(otp), 10),
      email: user.email,
      createdAt: Number(d),
      expiresAt: Number(d2),
      verified: false,
    });
    await OTP_Obj.save();

    const data = {
      name: user.name,
      email: user.email,
      otp: otp,
    };
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "mail-template",
      "index2.ejs"
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
      subject: "Greeting!",
      html: modifiedEmailTemplate,
    };
    await transporter.sendMail(message).catch((err) => {
      throw err;
    });
    res.status(201).json({ msg: "code sent.." });
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function verifyUser(req, res) {
  try {
    if (!req.body.otp) {
      return res.status(401).json("Must provide otp..");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    if (user.verified) {
      return res.status(400).json({ msg: "User already verified." });
    }
    const otp = await OTP.findOne({ email: user.email });
    if (!otp) {
      return res.status(404).json({ msg: "No OTP was sent." });
    }
    let d = new Date();
    if (Number(d) > Number(otp.expiresAt)) {
      return res.status(400).json({ msg: "OTP has expired." });
    }
    if (!(await bcrypt.compare(req.body.otp, otp.code))) {
      return res.status(401).json({ msg: "Wrong code." });
    }
    user.verified = true;
    await user.save();
    await OTP.deleteMany({ email: user.email });
    return res.status(200).json({ msg: "User verified successfully." });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function loginController(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json("Invalid Credentials");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found..");
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(404).json("Wrong Email or Password");
    }
    if (!user.verified) {
      return res.status(401).json("Account is not verified");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;

    return res.status(201).json({
      user: userWithoutPassword._doc,
      token: token,
    });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { signupController, resendOTP, verifyUser, loginController };
