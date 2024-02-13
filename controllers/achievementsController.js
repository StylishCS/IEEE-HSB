const { Achievement } = require("../models/achievements");
const cloudinary = require("../utils/cloudinary");

exports.addAchievement = async (req, res) => {
  try {
    if (!req.cloudinaryResult) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    req.body.image = req.cloudinaryResult.secure_url;

    await Achievement.create(req.body);

    return res.status(200).json({ msg: "Achievement added successfully" });
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
};

exports.getAchievements = async (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      data: res.paginatedResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ msg: "Not Found" });
    console.log(achievement.image.public_id);

    if (req.file) {
      req.body.image = req.cloudinaryResult.secure_url;
      const publicId = achievement.image.split("/").pop().split(".")[0];
      const oldImage = await cloudinary.uploader.destroy(publicId);
      console.log(oldImage);
    }

    await Achievement.updateOne({ _id: req.params.id }, req.body);
    return res.status(200).json({ msg: "Updated Successfully" });
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
};

exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ msg: "Not Found" });
    const publicId = achievement.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    await Achievement.deleteOne({ _id: req.params.id });
    return res.status(204).json({ msg: "Deleted Successfully" });
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
};

exports.getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById({ _id: req.params.id });
    if (!achievement) return res.status(404).json({ msg: "Not Found" });
    return res.status(200).json({ status: "success", data: achievement });
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
};
